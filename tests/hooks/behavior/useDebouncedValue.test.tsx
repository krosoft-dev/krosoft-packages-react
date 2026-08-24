import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { useDebouncedValue } from "../../../src/hooks/behavior/useDebouncedValue";

afterEach(() => {
  vi.useRealTimers();
});

describe("useDebouncedValue", () => {
  it("retourne la valeur initiale immédiatement", () => {
    const { result } = renderHook(() => useDebouncedValue("initial"));

    expect(result.current).toBe("initial");
  });

  it("ne met à jour la valeur qu'après le délai", () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 250), { initialProps: { value: "a" } });

    rerender({ value: "ab" });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(249);
    });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("ab");
  });

  it("ne retient que la dernière valeur d'une salve de changements", () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 250), { initialProps: { value: "a" } });

    rerender({ value: "ab" });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: "abc" });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    // Le timer a été relancé par la seconde frappe : rien n'a encore été publié.
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current).toBe("abc");
  });
});
