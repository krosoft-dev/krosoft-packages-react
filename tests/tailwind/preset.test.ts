import { describe, it, expect } from "vitest";
import resolveConfig from "tailwindcss/resolveConfig";
import type { Config } from "tailwindcss";
import krosoftPreset, { krosoftContent } from "../../src/tailwind";

/** `content` et `theme` sont typés `any` par tailwindcss : on les recadre ici plutôt qu'à chaque assertion. */
const resolveFiles = (config: Config): string[] => (resolveConfig(config).content as { files: string[] }).files;

const resolveBorderRadius = (config: Config): Record<string, string> => resolveConfig(config).theme?.borderRadius;

describe("preset Tailwind", () => {
  it("ne déclare pas de content : Tailwind ne le fusionnerait pas avec celui du projet", () => {
    // Raison d'être de krosoftContent : le content du projet écrase celui de ses presets,
    // un content porté par le preset serait donc silencieusement ignoré.
    expect(resolveFiles({ presets: [{ content: ["./preset.js"] }], content: ["./projet.tsx"] })).toEqual(["./projet.tsx"]);
    expect(krosoftPreset).not.toHaveProperty("content");
  });

  it("scanne le dist du package quand le projet étale krosoftContent", () => {
    const files = resolveFiles({ presets: [krosoftPreset], content: [...krosoftContent, "./src/**/*.tsx"] });

    expect(files).toEqual(["./node_modules/@krosoft/react/dist/**/*.js", "./src/**/*.tsx"]);
  });

  it("expose les radius sémantiques et leur repli sur --radius", () => {
    const borderRadius = resolveBorderRadius({ presets: [krosoftPreset], content: [] });

    expect(borderRadius.control).toBe("var(--k-radius-control, var(--radius))");
    expect(borderRadius.surface).toBe("var(--k-radius-surface, var(--radius))");
  });
});
