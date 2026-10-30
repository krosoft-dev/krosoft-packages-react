import type { ChangelogEntry } from "@/types/ChangelogEntry";
import type { ChangelogItem } from "@/types/ChangelogItem";

const ENTRY_TITLE = /^## +(.+?)\s*$/;
const TITLE_DATE = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/;

/** Slug façon GitHub (rehype-slug) : `2026-10-30 14:41` → `2026-10-30-1441`. */
export const slugifyChangelogTitle = (title: string): string =>
  title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .replace(/\s/g, "-");

const parseTitleDate = (title: string): { date?: Date; hasTime: boolean } => {
  const match = TITLE_DATE.exec(title);
  if (!match) {
    return { hasTime: false };
  }
  const [, year, month, day, hours, minutes] = match;
  const hasTime = hours !== undefined && minutes !== undefined;
  const date = new Date(Number(year), Number(month) - 1, Number(day), hasTime ? Number(hours) : 0, hasTime ? Number(minutes) : 0);
  return Number.isNaN(date.getTime()) ? { hasTime: false } : { date, hasTime };
};

/**
 * Découpe un journal markdown en entrées : une entrée par titre `##` (en général `## AAAA-MM-JJ HH:MM`),
 * dans l'ordre du fichier. Le texte placé avant le premier `##` est ignoré.
 */
export const parseChangelog = (markdown: string): ChangelogEntry[] => {
  const entries: ChangelogEntry[] = [];
  const usedIds = new Map<string, number>();
  let current: { title: string; lines: string[] } | undefined;

  const flush = (): void => {
    if (!current) {
      return;
    }
    // Même règle que rehype-slug pour les doublons : suffixe -1, -2...
    const slug = slugifyChangelogTitle(current.title);
    const count = usedIds.get(slug) ?? 0;
    usedIds.set(slug, count + 1);
    entries.push({
      id: count === 0 ? slug : `${slug}-${String(count)}`,
      title: current.title,
      ...parseTitleDate(current.title),
      content: current.lines.join("\n").trim(),
    });
  };

  for (const line of markdown.split(/\r?\n/)) {
    const title = ENTRY_TITLE.exec(line)?.[1];
    if (title !== undefined) {
      flush();
      current = { title, lines: [] };
    } else {
      current?.lines.push(line);
    }
  }
  flush();

  return entries;
};

// Préfixe de module d'un paragraphe : `**Factures** : ...` (fr) ou `**Invoices**: ...` (en).
const ITEM_TAG = /^\*\*([^*\n]+?)\*\*\s*:\s*/;

const capitalizeFirst = (text: string): string => text.charAt(0).toLocaleUpperCase() + text.slice(1);

/**
 * Découpe le contenu d'une entrée en éléments par module : chaque paragraphe qui commence par `**Module** :`
 * ouvre un élément, les blocs suivants (listes, paragraphes) lui restent rattachés jusqu'au module suivant.
 * Le texte placé avant le premier module forme un élément sans tag.
 */
export const splitChangelogItems = (content: string): ChangelogItem[] => {
  const items: ChangelogItem[] = [];
  const blocks = content
    .split(/\r?\n\s*\r?\n/)
    .map(block => block.trim())
    .filter(Boolean);

  for (const block of blocks) {
    const match = ITEM_TAG.exec(block);
    const last = items.length > 0 ? items[items.length - 1] : undefined;
    if (match) {
      // Le texte suit désormais un tag et non plus « Module : » : il commence par une majuscule.
      items.push({ tag: match[1].trim(), content: capitalizeFirst(block.slice(match[0].length)) });
    } else if (last) {
      last.content = `${last.content}\n\n${block}`;
    } else {
      items.push({ content: block });
    }
  }

  return items;
};

/** Minuscules sans accents, pour une recherche tolérante (`Évènement` trouve `evenement`). */
const normalizeSearchText = (text: string): string => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/**
 * Filtre les entrées dont le titre ou le contenu contient tous les mots de la recherche (sans casse ni accents)
 * et, si des modules sont choisis, qui touchent au moins l'un d'eux. Sans critère, toutes les entrées sont gardées.
 */
export const filterChangelog = (entries: ChangelogEntry[], query: string, tags: string[] = []): ChangelogEntry[] => {
  const terms = normalizeSearchText(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0 && tags.length === 0) {
    return entries;
  }
  return entries.filter(entry => {
    if (tags.length > 0 && !splitChangelogItems(entry.content).some(item => item.tag !== undefined && tags.includes(item.tag))) {
      return false;
    }
    const text = normalizeSearchText(`${entry.title}\n${entry.content}`);
    return terms.every(term => text.includes(term));
  });
};

/** Modules (tags) cités dans le journal, sans doublon, triés par ordre alphabétique. */
export const getChangelogTags = (entries: ChangelogEntry[]): string[] => {
  const tags = new Set(entries.flatMap(entry => splitChangelogItems(entry.content).flatMap(item => (item.tag === undefined ? [] : [item.tag]))));
  return [...tags].sort((a, b) => a.localeCompare(b));
};
