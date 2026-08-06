// @vitest-environment node
// Lecture de fichier uniquement : sous jsdom, import.meta.url n'est pas une URL file://.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { radiusPresets } from "../../src/tokens";

const css = readFileSync(fileURLToPath(new URL("../../src/styles/globals.css", import.meta.url)), "utf-8");

/** Déclarations d'un bloc `[data-radius="…"] { … }` de globals.css. */
const readCssPreset = (name: string): Record<string, string> => {
  const block = new RegExp(`\\[data-radius="${name}"\\]\\s*\\{([^}]*)\\}`).exec(css);
  if (!block) {
    throw new Error(`Aucun bloc [data-radius="${name}"] dans globals.css`);
  }

  return Object.fromEntries([...block[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([, property, value]) => [property, value.trim()]));
};

describe("presets de radius", () => {
  // Les presets existent en double : objets TS (application runtime) et blocs
  // [data-radius] dans globals.css (choix figé, sans flash au premier rendu).
  // Ce test est le garde-fou contre la dérive entre les deux.
  it.each(Object.entries(radiusPresets))("le bloc CSS [data-radius=%s] correspond au preset TS", (name, tokens) => {
    expect(readCssPreset(name)).toEqual(tokens);
  });

  it("les presets déclarent tous les mêmes variables", () => {
    const [reference, ...others] = Object.values(radiusPresets).map(tokens => Object.keys(tokens).sort());
    for (const keys of others) {
      expect(keys).toEqual(reference);
    }
  });
});
