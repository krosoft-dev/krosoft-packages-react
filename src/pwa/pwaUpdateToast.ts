import { toast } from "sonner";

export interface PwaUpdateToastOptions {
  /** Message annonçant la nouvelle version. */
  message: string;
  /** Libellé du bouton qui applique la mise à jour. */
  actionLabel: string;
  /** Libellé du bouton qui reporte la mise à jour. */
  dismissLabel: string;
  /** Applique la mise à jour (active le service worker en attente et recharge). */
  onUpdate: () => void;
  /** L'utilisateur reporte la mise à jour : elle sera reproposée au prochain chargement. */
  onDismiss: () => void;
}

/**
 * Toast de proposition de mise à jour PWA.
 *
 * Deux boutons explicites plutôt qu'une croix : « Actualiser » (action, primaire) et
 * « Ignorer » (cancel, secondaire). Un bouton labellisé est plus lisible qu'un « ✕ », et
 * « Ignorer » reporte simplement la mise à jour, reproposée au prochain chargement.
 *
 * Séparé de `PwaUpdater` pour être montrable dans Storybook : le composant importe
 * `virtual:pwa-register/react`, qui n'existe que sous `vite-plugin-pwa`.
 */
export const showPwaUpdateToast = ({
  message,
  actionLabel,
  dismissLabel,
  onUpdate,
  onDismiss,
}: PwaUpdateToastOptions): void => {
  toast(message, {
    // Aucune expiration : la proposition reste tant que l'utilisateur ne tranche pas.
    duration: Infinity,
    // Le balayage reste un filet de sécurité sur mobile, mais la fermeture passe
    // désormais par le bouton « Ignorer » : pas de croix.
    dismissible: true,
    // Message pleine largeur sur la première ligne, les deux boutons groupés à droite
    // sur la seconde. `!ml-0` neutralise les marges `auto` que sonner pose sur chaque
    // bouton : avec deux boutons elles répartissent l'espace libre avant ET entre eux
    // (effet centré). Sans elles, `justify-end` colle le groupe à droite, gap de 6px.
    classNames: {
      toast: "!flex-wrap !justify-end",
      content: "!basis-full",
      actionButton: "!ml-0",
      // « Ignorer » en ghost : on efface le fond `bg-muted` du Toaster global
      // (`!bg-transparent`), fond accent seulement au survol.
      cancelButton: "!ml-0 !bg-transparent !text-muted-foreground hover:!bg-accent hover:!text-accent-foreground",
    },
    action: {
      label: actionLabel,
      onClick: onUpdate,
    },
    cancel: {
      label: dismissLabel,
      onClick: onDismiss,
    },
    onDismiss,
  });
};
