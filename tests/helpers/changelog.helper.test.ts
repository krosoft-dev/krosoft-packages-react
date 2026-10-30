import { describe, it, expect } from "vitest";
import { filterChangelog, getChangelogTags, parseChangelog, slugifyChangelogTitle, splitChangelogItems } from "../../src/helpers";

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

describe("filterChangelog", () => {
  const entries = parseChangelog(CHANGELOG);

  it("renvoie toutes les entrées pour une recherche vide", () => {
    expect(filterChangelog(entries, "  ")).toHaveLength(2);
  });

  it("ignore la casse et les accents", () => {
    expect(filterChangelog(entries, "periode").map(entry => entry.id)).toEqual(["2026-10-29"]);
    expect(filterChangelog(entries, "FACTURES").map(entry => entry.id)).toEqual(["2026-10-30-1441"]);
  });

  it("exige tous les mots de la recherche", () => {
    expect(filterChangelog(entries, "tableau détail")).toHaveLength(1);
    expect(filterChangelog(entries, "tableau csv")).toHaveLength(0);
  });

  it("cherche aussi dans le titre", () => {
    expect(filterChangelog(entries, "2026-10-30").map(entry => entry.id)).toEqual(["2026-10-30-1441"]);
  });
});

describe("splitChangelogItems", () => {
  it("extrait le module en tag, en français comme en anglais", () => {
    expect(splitChangelogItems("**Factures** : export CSV.\n\n**Invoices**: CSV export.")).toEqual([
      { tag: "Factures", content: "Export CSV." },
      { tag: "Invoices", content: "CSV export." },
    ]);
  });

  it("rattache les blocs suivants (liste) au module précédent", () => {
    expect(splitChangelogItems("**Factures** : export CSV.\n\n- Colonnes visibles\n- UTF-8")).toEqual([
      { tag: "Factures", content: "Export CSV.\n\n- Colonnes visibles\n- UTF-8" },
    ]);
  });

  it("garde un texte sans module en élément sans tag", () => {
    expect(splitChangelogItems("Version de maintenance.\n\n**Profil** : avatar.")).toEqual([
      { content: "Version de maintenance." },
      { tag: "Profil", content: "Avatar." },
    ]);
  });

  it("ne prend pas un gras en milieu de phrase pour un module", () => {
    expect(splitChangelogItems("Le **nouveau** filtre : voir la liste.")).toEqual([{ content: "Le **nouveau** filtre : voir la liste." }]);
  });
});

describe("filtres par module", () => {
  const entries = parseChangelog(`## 2026-10-30 14:41

**Factures** : export CSV.

**Profil** : avatar.

## 2026-10-29 10:00

**Tableau de bord** : total.

## 2026-10-28 09:00

**Factures** : rejet.
`);

  it("liste les modules sans doublon, triés", () => {
    expect(getChangelogTags(entries)).toEqual(["Factures", "Profil", "Tableau de bord"]);
  });

  it("garde les entrées qui touchent au moins un des modules choisis", () => {
    expect(filterChangelog(entries, "", ["Factures"]).map(entry => entry.id)).toEqual(["2026-10-30-1441", "2026-10-28-0900"]);
    expect(filterChangelog(entries, "", ["Profil", "Tableau de bord"]).map(entry => entry.id)).toEqual(["2026-10-30-1441", "2026-10-29-1000"]);
  });

  it("combine modules et recherche texte", () => {
    expect(filterChangelog(entries, "rejet", ["Factures"]).map(entry => entry.id)).toEqual(["2026-10-28-0900"]);
  });
});
