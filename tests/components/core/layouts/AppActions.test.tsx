import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppActions } from "../../../../src/components/core/layouts/AppActions";
import type { AppAction } from "../../../../src/types";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

/** Rend le formulaire cible à côté de la barre d'actions, comme dans une page réelle. */
const renderWithForm = (actions: AppAction[], onSubmit: () => void): void => {
  render(
    <>
      <AppActions actions={actions} />
      <form
        id="details"
        onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <input aria-label="Nom" />
      </form>
    </>,
  );
};

// Le bouton d'action vit hors du <form> (en-tête de page, barre d'actions) : c'est
// l'attribut `form` qui les relie, à la place de la fonction de submit remontée avant.
describe("AppActions — action de soumission", () => {
  it("relie le bouton au formulaire ciblé", () => {
    renderWithForm([{ labelKey: "Sauvegarder", type: "submit", form: "details" }], vi.fn());

    const bouton = screen.getByRole("button", { name: "Sauvegarder" });
    expect(bouton.getAttribute("type")).toBe("submit");
    expect(bouton.getAttribute("form")).toBe("details");
  });

  it("soumet le formulaire au clic", async () => {
    const onSubmit = vi.fn();
    renderWithForm([{ labelKey: "Sauvegarder", type: "submit", form: "details" }], onSubmit);

    await userEvent.click(screen.getByRole("button", { name: "Sauvegarder" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledOnce();
    });
  });

  it("laisse les actions classiques sur onClick, sans attribut de soumission", async () => {
    const onClick = vi.fn();
    render(<AppActions actions={[{ labelKey: "Annuler", onClick }]} />);

    const bouton = screen.getByRole("button", { name: "Annuler" });
    expect(bouton.getAttribute("form")).toBeNull();

    await userEvent.click(bouton);
    expect(onClick).toHaveBeenCalledOnce();
  });
});

// Sur mobile, les actions sont rendues en `DropdownMenuItem` — un div[role=menuitem]
// que l'attribut `form` ne relie à aucun formulaire : le repli passe par requestSubmit().
describe("AppActions — action de soumission sur mobile", () => {
  it("soumet le formulaire depuis le menu", async () => {
    vi.stubGlobal("innerWidth", 500);
    const onSubmit = vi.fn();
    renderWithForm([{ labelKey: "Sauvegarder", type: "submit", form: "details" }], onSubmit);

    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(await screen.findByRole("menuitem", { name: "Sauvegarder" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledOnce();
    });
  });
});
