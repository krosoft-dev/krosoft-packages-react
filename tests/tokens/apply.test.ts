import { beforeEach, describe, expect, it } from "vitest";
import { applyTokenPreset, applyTokens, clearTokens, radiusPresets } from "../../src/tokens";
import type { TokenFamily } from "../../src/tokens";

describe("applyTokens", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("style");
  });

  it("pose les variables sur <html> par défaut", () => {
    applyTokens({ "--k-radius-control": "3px" });

    expect(document.documentElement.style.getPropertyValue("--k-radius-control")).toBe("3px");
  });

  it("cible l'élément fourni sans toucher au document", () => {
    const element = document.createElement("div");

    applyTokens({ "--k-radius-control": "3px" }, element);

    expect(element.style.getPropertyValue("--k-radius-control")).toBe("3px");
    expect(document.documentElement.style.getPropertyValue("--k-radius-control")).toBe("");
  });
});

describe("clearTokens", () => {
  it("retire les variables posées", () => {
    const element = document.createElement("div");
    applyTokens(radiusPresets.round, element);

    clearTokens(radiusPresets.round, element);

    expect(element.getAttribute("style")).toBe("");
  });
});

describe("applyTokenPreset", () => {
  it("applique les variables du preset demandé", () => {
    const element = document.createElement("div");

    applyTokenPreset(radiusPresets, "round", element);

    expect(element.style.getPropertyValue("--k-radius-control")).toBe("9999px");
    expect(element.style.getPropertyValue("--k-radius-surface")).toBe("1.25rem");
  });

  it("ne laisse aucun résidu du preset précédent", () => {
    // Famille volontairement irrégulière : "compact" ne déclare pas --gap.
    const family = {
      large: { "--size": "2rem", "--gap": "1rem" },
      compact: { "--size": "1rem" },
    } satisfies TokenFamily;
    const element = document.createElement("div");

    applyTokenPreset(family, "large", element);
    applyTokenPreset(family, "compact", element);

    expect(element.style.getPropertyValue("--size")).toBe("1rem");
    expect(element.style.getPropertyValue("--gap")).toBe("");
  });
});
