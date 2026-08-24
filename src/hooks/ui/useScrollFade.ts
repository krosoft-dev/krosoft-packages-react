import { useLayoutEffect, useState, type CSSProperties, type RefObject } from "react";

/** Largeur du dégradé appliqué à chaque extrémité. */
const FADE_SIZE = "1.5rem";

/**
 * Fondu sur les bords d'un conteneur à défilement horizontal, pour signaler le contenu hors écran.
 *
 * Renvoie un style à poser sur le conteneur. C'est un `mask-image` et non un dégradé superposé :
 * un dégradé doit connaître la couleur de fond, or le conteneur peut être posé sur la page, une
 * carte ou un dialog. Le fondu n'apparaît que du côté où il reste réellement du contenu à faire
 * défiler, et disparaît donc quand tout tient dans la largeur.
 */
export function useScrollFade(ref: RefObject<HTMLElement | null>): CSSProperties {
  const [fade, setFade] = useState({ start: false, end: false });

  // Effet sans tableau de dépendances : la mesure doit être refaite à chaque rendu. Un onglet
  // ajouté ou un libellé traduit après coup change la largeur du contenu sans déclencher ni
  // défilement ni redimensionnement du conteneur, les deux seuls événements observés ici.
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = (): void => {
      const maxScroll = element.scrollWidth - element.clientWidth;
      // Tolérance de 1px : les navigateurs renvoient des positions fractionnaires hors zoom 100%.
      const start = element.scrollLeft > 1;
      const end = element.scrollLeft < maxScroll - 1;
      // Conserver l'objet précédent à l'identique évite un rendu de plus à chaque défilement.
      setFade(previous => (previous.start === start && previous.end === end ? previous : { start, end }));
    };

    update();
    element.addEventListener("scroll", update, { passive: true });
    // ResizeObserver n'existe pas dans jsdom : sans ce garde, tout test rendant le composant planterait.
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(element);

    return () => {
      element.removeEventListener("scroll", update);
      observer?.disconnect();
    };
  });

  // Pas de masque du tout quand rien ne dépasse : inutile de faire calculer un masque opaque au
  // navigateur, qui repasse l'élément dans une couche de composition pour rien.
  if (!fade.start && !fade.end) return {};

  // Le masque d'un dégradé est interprété en alpha (mask-mode: match-source) : les zones
  // transparentes effacent, les zones opaques laissent voir, quelle que soit la couleur.
  // mask-image est écrit sans préfixe -webkit- : la propriété est disponible partout depuis
  // Chrome 120 / Safari 15.4.
  return {
    maskImage: `linear-gradient(to right, transparent 0, #000 ${fade.start ? FADE_SIZE : "0px"}, #000 calc(100% - ${fade.end ? FADE_SIZE : "0px"}), transparent 100%)`,
  };
}
