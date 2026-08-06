// @vitest-environment node
// Lecture de fichier uniquement : sous jsdom, import.meta.url n'est pas une URL file://.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { radiusPresets } from "../../src/tokens";

const css = readFileSync(fileURLToPath(new URL("../../src/styles/globals.css", import.meta.url)), "utf-8");

/** Valeur d'une variable déclarée dans le bloc `:root` de globals.css. */
const readRootToken = (name: string): string | undefined => {
  const root = /:root\s*\{([\s\S]*?)\n\s*\}/.exec(css);
  if (!root) {
    throw new Error("Aucun bloc :root dans globals.css");
  }

  return new RegExp(`${name}\\s*:\\s*([^;]+);`).exec(root[1])?.[1].trim();
};

describe("presets de radius", () => {
  // Le README et le commentaire de globals.css annoncent que les valeurs par
  // défaut sont celles de "soft" : ce test empêche les deux de diverger.
  it.each(Object.entries(radiusPresets.soft))("la valeur par défaut de %s est celle du preset soft", (name, value) => {
    expect(readRootToken(name)).toBe(value);
  });

  it("les presets déclarent tous les mêmes variables", () => {
    const [reference, ...others] = Object.values(radiusPresets).map(tokens => Object.keys(tokens).sort());
    for (const keys of others) {
      expect(keys).toEqual(reference);
    }
  });
});
