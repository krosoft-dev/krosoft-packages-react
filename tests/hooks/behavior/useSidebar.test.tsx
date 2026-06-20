import * as React from "react";
import { renderHook } from "@testing-library/react";
import { describe, it, expect, beforeAll } from "vitest";
import { useSidebar } from "../../../src/hooks/behavior/useSidebar";
import { SidebarProvider } from "../../../src/providers/SidebarProvider";

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

describe("useSidebar", () => {
  it("lève une erreur en dehors d'un SidebarProvider", () => {
    expect(() => renderHook(() => useSidebar())).toThrow("useSidebar must be used within a SidebarProvider");
  });

  it("retourne le contexte à l'intérieur d'un SidebarProvider", () => {
    const wrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => <SidebarProvider>{children}</SidebarProvider>;

    const { result } = renderHook(() => useSidebar(), { wrapper });

    expect(result.current.collapsed).toBe(false);
    expect(result.current.isMobile).toBe(false);
    expect(typeof result.current.toggleSidebar).toBe("function");
    expect(typeof result.current.setCollapsed).toBe("function");
  });
});
