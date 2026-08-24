import { cleanup, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { Toaster, toast } from "../../../src/components/ui/sonner";

// Sonner interroge `prefers-reduced-motion` au montage, absent de jsdom.
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

afterEach(() => {
  toast.dismiss();
  cleanup();
});

const showUpdateToast = (): void => {
  toast("Une nouvelle version est disponible.", {
    closeButton: true,
    action: { label: "Actualiser", onClick: vi.fn() },
  });
};

// Sonner pose sa croix en absolu, en pastille cerclée débordant du coin du toast : sur la
// proposition de mise à jour, elle flottait loin du bouton « Actualiser ». On la remet dans
// le flux pour qu'elle se pose juste après l'action, comme une icône de fermeture ordinaire.
describe("croix de fermeture des toasts", () => {
  it("range la croix dans le flux, après le bouton d'action", async () => {
    render(<Toaster />);

    showUpdateToast();
    const closeButton = await screen.findByLabelText("Close toast");

    expect(closeButton.className.split(/\s+/)).toEqual(expect.arrayContaining(["!static", "!order-last", "!transform-none"]));
    expect(closeButton.parentElement).toBe(screen.getByText("Actualiser").parentElement);
  });

  it("dépouille la pastille de sonner de son cercle et de son fond", async () => {
    render(<Toaster />);

    showUpdateToast();
    const closeButton = await screen.findByLabelText("Close toast");

    expect(closeButton.className.split(/\s+/)).toEqual(expect.arrayContaining(["!border-0", "!bg-transparent", "!rounded-control"]));
  });
});
