import type { JSX, MouseEvent } from "react";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useLocation, useNavigate } from "react-router-dom";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { cn } from "@/helpers/tailwind.helper";
import { rehypeVersionSlug } from "@/helpers/markdown.helper";
import { AppMarkdownHeading } from "./AppMarkdownHeading";

export interface AppMarkdownProps {
  /** Contenu markdown (GFM : tableaux, listes de tâches, liens auto...). */
  content: string;
  /**
   * Ancres partageables sur les titres h2-h4 (bouton « copier le lien » + scroll sur le hash de l'url).
   * À désactiver quand le markdown n'est pas le contenu principal de la page (dialog, panneau...).
   */
  headingAnchors?: boolean;
}

/**
 * Rendu markdown aligné sur le design system : pas de plugin typography dans le preset Tailwind,
 * chaque élément est donc mappé sur les tokens.
 * rehype-slug ajoute un id (slug façon GitHub) sur chaque titre pour que les ancres fonctionnent ;
 * rehypeVersionSlug raccourcit ensuite l'id des titres de version d'un changelog (`v1.0.41`).
 */
export const AppMarkdown = ({ content, headingAnchors = true }: AppMarkdownProps): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hash } = location;

  // Le contenu est souvent chargé après le rendu de la page : au moment où le navigateur traite le hash
  // de l'url, la cible n'existe pas encore. On refait donc le scroll dès que le markdown est rendu.
  useEffect(() => {
    if (!headingAnchors || !hash) {
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    // Une frame d'attente : react-markdown vient de rendre, le layout n'est pas encore stabilisé.
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [headingAnchors, hash, content]);

  // Ancre interne (#slug) : on pose le hash dans l'url au lieu de laisser le navigateur naviguer,
  // ce qui casserait le routing react-router. Sans ancres de titres, on scrolle simplement vers la cible.
  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>, href: string): void => {
    const id = decodeURIComponent(href.slice(1));
    const target = document.getElementById(id);
    if (!target) {
      return;
    }
    event.preventDefault();
    if (headingAnchors) {
      void navigate({ search: location.search, hash: href });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug, rehypeVersionSlug]}
      components={{
        // On forwarde `id` : c'est l'ancre posée par les plugins, cible des liens du sommaire.
        h1: ({ id, children }) => (
          <h1 id={id} className="text-2xl font-bold text-foreground mt-2 mb-4 first:mt-0 scroll-mt-4">
            {children}
          </h1>
        ),
        h2: ({ id, children }) => (
          <AppMarkdownHeading
            anchor={headingAnchors}
            level={2}
            id={id}
            className={cn("text-xl font-semibold text-foreground mt-8 mb-3 border-b pb-2 scroll-mt-4", !headingAnchors && "first:mt-0")}
          >
            {children}
          </AppMarkdownHeading>
        ),
        h3: ({ id, children }) => (
          <AppMarkdownHeading anchor={headingAnchors} level={3} id={id} className="text-base font-semibold text-foreground mt-6 mb-2 scroll-mt-4">
            {children}
          </AppMarkdownHeading>
        ),
        h4: ({ id, children }) => (
          <AppMarkdownHeading anchor={headingAnchors} level={4} id={id} className="text-sm font-semibold text-foreground mt-4 mb-2 scroll-mt-4">
            {children}
          </AppMarkdownHeading>
        ),
        p: ({ children }) => <p className="text-sm text-foreground leading-relaxed mb-3">{children}</p>,
        a: ({ href, children }) => {
          const isAnchor = href?.startsWith("#");
          return (
            <a
              href={href}
              target={isAnchor ? undefined : "_blank"}
              rel={isAnchor ? undefined : "noopener noreferrer"}
              onClick={
                isAnchor && href
                  ? event => {
                      handleAnchorClick(event, href);
                    }
                  : undefined
              }
              className="text-primary underline underline-offset-2 hover:opacity-80"
            >
              {children}
            </a>
          );
        },
        ul: ({ children }) => <ul className="list-disc pl-6 mb-3 space-y-1 text-sm text-foreground">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 mb-3 space-y-1 text-sm text-foreground">{children}</ol>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-muted-foreground/30 bg-muted/50 px-4 py-2 mb-3 text-sm text-muted-foreground [&>p]:mb-0">
            {children}
          </blockquote>
        ),
        code: ({ className, children }) => {
          // Les blocs de code (```bash) arrivent avec une classe "language-*", le code inline sans classe.
          const isBlock = !!className;
          if (isBlock) {
            return <code className={`${className} block text-xs font-mono`}>{children}</code>;
          }
          return <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{children}</code>;
        },
        pre: ({ children }) => <pre className="bg-muted rounded-md p-4 mb-3 overflow-x-auto">{children}</pre>,
        table: ({ children }) => (
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-sm border-collapse">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="border-b">{children}</thead>,
        th: ({ children }) => <th className="text-left font-semibold text-foreground px-3 py-2">{children}</th>,
        td: ({ children }) => <td className="border-b border-muted px-3 py-2 text-foreground">{children}</td>,
        hr: () => <hr className="my-6 border-muted" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
