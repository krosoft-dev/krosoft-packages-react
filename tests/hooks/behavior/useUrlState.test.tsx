import * as React from "react";
import { act, renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { parseDateRange, serializeDateRange, useUrlArrayState, useUrlNumberState, useUrlState } from "../../../src/hooks/behavior/useUrlState";

const wrapper = (initialEntries: string[] = ["/"]) =>
  function RouterWrapper({ children }: { children: React.ReactNode }): React.ReactElement {
    return <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>;
  };

describe("useUrlState", () => {
  it("retourne la valeur par défaut quand le paramètre est absent", () => {
    const { result } = renderHook(() => useUrlState("q", "défaut"), { wrapper: wrapper() });

    expect(result.current[0]).toBe("défaut");
  });

  it("lit la valeur présente dans l'URL", () => {
    const { result } = renderHook(() => useUrlState("q", "défaut"), { wrapper: wrapper(["/?q=bonjour"]) });

    expect(result.current[0]).toBe("bonjour");
  });

  it("écrit la valeur dans l'URL, et la retire quand elle vaut le défaut", () => {
    const { result } = renderHook(() => useUrlState("q", "défaut"), { wrapper: wrapper() });

    act(() => {
      result.current[1]("bonjour");
    });
    expect(result.current[0]).toBe("bonjour");

    act(() => {
      result.current[1]("défaut");
    });
    expect(result.current[0]).toBe("défaut");
  });
});

describe("useUrlArrayState", () => {
  it("analyse une liste séparée par des virgules", () => {
    const { result } = renderHook(() => useUrlArrayState("tags"), { wrapper: wrapper(["/?tags=a,b,c"]) });

    expect(result.current[0]).toEqual(["a", "b", "c"]);
  });

  it("sérialise puis vide le paramètre", () => {
    const { result } = renderHook(() => useUrlArrayState("tags"), { wrapper: wrapper() });

    act(() => {
      result.current[1](["a", "b"]);
    });
    expect(result.current[0]).toEqual(["a", "b"]);

    act(() => {
      result.current[1]([]);
    });
    expect(result.current[0]).toEqual([]);
  });
});

describe("useUrlNumberState", () => {
  it("analyse un nombre, avec repli sur le défaut", () => {
    const valid = renderHook(() => useUrlNumberState("page", 1), { wrapper: wrapper(["/?page=3"]) });
    expect(valid.result.current[0]).toBe(3);

    const invalid = renderHook(() => useUrlNumberState("page", 1), { wrapper: wrapper(["/?page=abc"]) });
    expect(invalid.result.current[0]).toBe(1);
  });
});

describe("parseDateRange / serializeDateRange", () => {
  it("fait l'aller-retour d'une plage complète", () => {
    const range = parseDateRange("2026-01-15_2026-02-20");

    expect(range?.from?.getFullYear()).toBe(2026);
    expect(serializeDateRange(range)).toBe("2026-01-15_2026-02-20");
  });

  it("gère une borne haute absente", () => {
    const range = parseDateRange("2026-01-15");

    expect(range?.to).toBeUndefined();
    expect(serializeDateRange(range)).toBe("2026-01-15");
  });

  it("renvoie undefined pour une valeur vide ou invalide", () => {
    expect(parseDateRange("")).toBeUndefined();
    expect(parseDateRange("pas-une-date")).toBeUndefined();
    expect(serializeDateRange(undefined)).toBe("");
  });
});
