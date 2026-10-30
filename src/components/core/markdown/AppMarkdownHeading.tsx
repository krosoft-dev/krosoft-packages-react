import type { JSX, ReactNode } from "react";
import { LinkIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/helpers/tailwind.helper";
import { useNotifications } from "@/hooks/ui/useNotifications";
import { useKrosoftTranslation } from "@/i18n";

interface AppMarkdownHeadingProps {
  level: 2 | 3 | 4;
  className?: string;
  id?: string;
  /** Affiche le bouton « copier le lien » ; à faux, le titre est rendu nu (id conservé). */
  anchor?: boolean;
  children: ReactNode;
}

const HEADING_TAGS = { 2: "h2", 3: "h3", 4: "h4" } as const;

/**
 * Titre markdown doté d'une ancre partageable : l'icône affichée au survol copie l'url complète
 * de la section (query + ancre) et positionne le hash pour que le lien soit rejouable.
 * L'id vient de rehype-slug, ou de `rehypeVersionSlug` pour les titres de version d'un changelog.
 */
export const AppMarkdownHeading = ({ level, className, id, anchor = true, children }: AppMarkdownHeadingProps): JSX.Element => {
  const { t } = useKrosoftTranslation();
  const { showSuccess, showError } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const Heading = HEADING_TAGS[level];

  // Sans id (titre vide, ou plugin qui n'a rien slugué) il n'y a rien à partager : titre nu.
  if (!anchor || !id) {
    return (
      <Heading id={id} className={className}>
        {children}
      </Heading>
    );
  }

  const copyLink = async (): Promise<void> => {
    // Le hash est posé d'abord : si le presse-papiers est refusé (navigateur restrictif, contexte non
    // sécurisé), l'url de la barre d'adresse reste copiable à la main.
    // replace : l'ancre n'est pas une étape de navigation, le bouton retour ne doit pas la rejouer.
    void navigate({ search: location.search, hash: `#${id}` }, { replace: true });

    // On conserve la query : elle porte l'état de la page (onglet...), sans quoi le lien n'ouvre pas le bon contenu.
    const url = `${window.location.origin}${location.pathname}${location.search}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      showSuccess(t("markdown.linkCopied"));
    } catch (_) {
      showError(t("markdown.linkCopyError"));
    }
  };

  return (
    <Heading id={id} className={cn("group", className)}>
      {children}
      <button
        type="button"
        onClick={() => void copyLink()}
        title={t("markdown.copyLink")}
        aria-label={t("markdown.copyLink")}
        className="ml-2 inline-flex align-middle text-muted-foreground transition-opacity hover:text-primary md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
      >
        <LinkIcon className="size-4" />
      </button>
    </Heading>
  );
};
