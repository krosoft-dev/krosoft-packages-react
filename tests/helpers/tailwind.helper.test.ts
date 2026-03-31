import { cn } from "../../src/helpers";
import { describe, it, expect } from "vitest";

describe("cn", () => {
  it("fusionne des classes simples", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("résout les conflits tailwind", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });

  it("ignore les valeurs falsy", () => {
    expect(cn("foo", undefined, null, false, "bar")).toBe("foo bar");
  });

  it("gère les classes conditionnelles", () => {
    expect(cn("foo", { bar: true, baz: false })).toBe("foo bar");
  });
});
