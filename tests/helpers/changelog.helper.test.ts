import { describe, it, expect } from "vitest";
import { parseChangelog, slugifyChangelogTitle } from "../../src/helpers";

const CHANGELOG = `Texte d'introduction ignoré.

## 2026-10-30 14:41

**Factures** : export CSV.

## 2026-10-29

**Tableau de bord** : total de la période.

- Détail
`;

describe("slugifyChangelogTitle", () => {
  it("produit le même slug que rehype-slug pour un titre daté", () => {
    expect(slugifyChangelogTitle("2026-10-30 14:41")).toBe("2026-10-30-1441");
  });
});

describe("parseChangelog", () => {
  it("découpe une entrée par titre `##` en ignorant l'introduction", () => {
    const entries = parseChangelog(CHANGELOG);
    expect(entries.map(entry => entry.id)).toEqual(["2026-10-30-1441", "2026-10-29"]);
    expect(entries[0].content).toBe("**Factures** : export CSV.");
    expect(entries[1].content).toBe("**Tableau de bord** : total de la période.\n\n- Détail");
  });

  it("lit la date et l'heure du titre", () => {
    const [withTime, withoutTime] = parseChangelog(CHANGELOG);
    expect(withTime.hasTime).toBe(true);
    expect(withTime.date).toEqual(new Date(2026, 9, 30, 14, 41));
    expect(withoutTime.hasTime).toBe(false);
    expect(withoutTime.date).toEqual(new Date(2026, 9, 29));
  });

  it("laisse la date vide quand le titre n'en contient pas", () => {
    const [entry] = parseChangelog("## Version initiale\n\nTexte");
    expect(entry.date).toBeUndefined();
    expect(entry.id).toBe("version-initiale");
  });

  it("suffixe les ancres en doublon comme rehype-slug", () => {
    const entries = parseChangelog("## 2026-10-30 14:41\n\nA\n\n## 2026-10-30 14:41\n\nB");
    expect(entries.map(entry => entry.id)).toEqual(["2026-10-30-1441", "2026-10-30-1441-1"]);
  });

  it("accepte les fins de ligne Windows", () => {
    expect(parseChangelog("## 2026-10-30 14:41\r\n\r\nA\r\n")[0].content).toBe("A");
  });
});
