import type { ChangelogEntry } from "@/types/ChangelogEntry";

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
