import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import FormDialog from "../../../../src/components/core/dialogs/FormDialog";
import type { FormSchema } from "../../../../src/types";

afterEach(() => {
  cleanup();
});

interface Contact {
  nom: string;
}

const schema: FormSchema<Contact> = {
  useCards: false,
  sections: [{ fields: [{ key: "nom", labelKey: "Nom", type: "text" }] }],
};

// Le pied de la dialog est rendu hors du <form> du contenu : c'est l'attribut `form`
// du bouton qui les relie, à la place de la fonction de submit qu'on remontait avant.
describe("FormDialog — enregistrement", () => {
  it("soumet le formulaire depuis le pied de la dialog", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<FormDialog open onOpenChange={() => {}} data={{ nom: "Dupont" }} title={() => "Fiche"} schema={schema} onSave={onSave} defaultEditing />);

    const save = screen.getByRole("button", { name: /Enregistrer/ });
    expect(save.getAttribute("form")).toBe(screen.getByRole("textbox").closest("form")?.id);

    await userEvent.click(save);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ nom: "Dupont" }));
    });
  });

  it("enregistre la valeur saisie", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<FormDialog open onOpenChange={() => {}} data={{ nom: "Dupont" }} title={() => "Fiche"} schema={schema} onSave={onSave} defaultEditing />);

    const input = screen.getByRole("textbox");
    await userEvent.clear(input);
    await userEvent.type(input, "Martin");
    await userEvent.click(screen.getByRole("button", { name: /Enregistrer/ }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ nom: "Martin" }));
    });
  });

  it("passe en édition depuis le mode lecture", async () => {
    render(<FormDialog open onOpenChange={() => {}} data={{ nom: "Dupont" }} title={() => "Fiche"} schema={schema} onSave={vi.fn()} />);

    expect(screen.getByRole("textbox")).toHaveProperty("disabled", true);

    await userEvent.click(screen.getByRole("button", { name: "Modifier" }));

    expect(screen.getByRole("textbox")).toHaveProperty("disabled", false);
    expect(screen.getByRole("button", { name: /Enregistrer/ })).toBeTruthy();
  });

  it("soumet aussi depuis le pied rendu dans le contenu (footerActions=false)", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(
      <FormDialog open onOpenChange={() => {}} data={{ nom: "Dupont" }} title={() => "Fiche"} schema={schema} onSave={onSave} defaultEditing footerActions={false} />,
    );

    await userEvent.click(screen.getByRole("button", { name: /Enregistrer/ }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledOnce();
    });
  });
});
