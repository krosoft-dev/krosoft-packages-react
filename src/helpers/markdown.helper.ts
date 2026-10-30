// Types hast minimaux : on ne dépend pas de `@types/hast`, présent seulement en transitif.
interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

const HEADING_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

// Titres de version du changelog : `## [1.0.41] - 2026-09-02 21:03`, ou `## [1.0.37] – [1.0.38] - ...`.
const VERSION_PATTERN = /\[v?(\d+(?:\.\d+)+)]/;

const getTextContent = (node: HastNode): string => {
  if (node.type === "text") {
    return node.value ?? "";
  }
  return (node.children ?? []).map(getTextContent).join("");
};

/**
 * Rebase l'id des titres de version sur la seule version (`[1.0.41] - 2026-09-02 21:03` -> `v1.0.41`).
 * Le slug de rehype-slug embarque la date et la ponctuation du titre : un lien partagé casserait à la
 * moindre correction du libellé, alors que la version, elle, ne bouge plus.
 * À enchaîner APRÈS rehype-slug, dont il écrase l'id sur ces titres uniquement.
 * Un titre couvrant plusieurs versions n'expose que la première comme ancre.
 */
export const rehypeVersionSlug =
  () =>
  (tree: HastNode): void => {
    const visit = (node: HastNode): void => {
      if (node.type === "element" && node.tagName && HEADING_TAGS.has(node.tagName)) {
        const version = VERSION_PATTERN.exec(getTextContent(node))?.[1];
        if (version) {
          node.properties = { ...node.properties, id: `v${version}` };
        }
      }
      node.children?.forEach(visit);
    };

    visit(tree);
  };
