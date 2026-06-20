import * as React from "react";
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { useSidebar } from "../../src/hooks/behavior/useSidebar";
import { SidebarProvider } from "../../src/providers/SidebarProvider";

const wrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => <SidebarProvider>{children}</SidebarProvider>;

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
});

beforeEach(() => {
  // Réinitialise le cookie entre chaque test.
  document.cookie = "sidebar:collapsed=; path=/; max-age=0";
});

describe("SidebarProvider", () => {
  it("bascule l'état via toggleSidebar", () => {
    const { result } = renderHook(() => useSidebar(), { wrapper });

    expect(result.current.collapsed).toBe(false);
    act(() => {
      result.current.toggleSidebar();
    });
    expect(result.current.collapsed).toBe(true);
  });

  it("écrit l'état dans un cookie quand il change", () => {
    const { result } = renderHook(() => useSidebar(), { wrapper });

    act(() => {
      result.current.setCollapsed(true);
    });

    expect(document.cookie).toContain("sidebar:collapsed=true");
  });

  it("restaure l'état depuis le cookie au montage", () => {
    document.cookie = "sidebar:collapsed=true; path=/";

    const { result } = renderHook(() => useSidebar(), { wrapper });

    expect(result.current.collapsed).toBe(true);
  });

  it("bascule l'état via le raccourci clavier Ctrl/Cmd+B", () => {
    const { result } = renderHook(() => useSidebar(), { wrapper });

    expect(result.current.collapsed).toBe(false);
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "b", ctrlKey: true }));
    });
    expect(result.current.collapsed).toBe(true);
  });
});
