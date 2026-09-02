import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GenericForm } from "../../../../src/components/core/forms/GenericForm";
import type { FormSchema } from "../../../../src/types";

interface Client {
  nom: string;
  logo: string;
}

const schema: FormSchema<Client> = {
  useCards: false,
  sections: [
    {
      fields: [
        { key: "nom", labelKey: "client.nom", type: "text" },
        { key: "logo", labelKey: "client.logo", type: "image" },
      ],
    },
  ],
};

afterEach(() => {
  cleanup();
});

describe("GenericForm", () => {
  it("ne rend rien tant que le schéma n'est pas disponible", () => {
    const { container } = render(<GenericForm<Client> schema={null} onSubmit={vi.fn()} />);

    expect(container.innerHTML).toBe("");
  });

  // Les hooks sont appelés inconditionnellement : un schéma chargé de façon asynchrone
  // ne doit ni casser l'ordre des hooks, ni perdre les valeurs initiales du formulaire.
  it("injecte les valeurs initiales quand le schéma arrive après le montage", () => {
    const initialData: Client = { nom: "Krosoft", logo: "https://krosoft.test/logo.png" };
    const { rerender } = render(<GenericForm<Client> schema={null} initialData={initialData} onSubmit={vi.fn()} />);

    rerender(<GenericForm<Client> schema={schema} initialData={initialData} onSubmit={vi.fn()} />);

    expect(screen.getByDisplayValue("Krosoft")).toBeDefined();
  });

  it("affiche l'aperçu de l'image portée par les données initiales", () => {
    const initialData: Client = { nom: "Krosoft", logo: "https://krosoft.test/logo.png" };

    render(<GenericForm<Client> schema={schema} initialData={initialData} onSubmit={vi.fn()} />);

    expect(screen.getByRole("img").getAttribute("src")).toBe("https://krosoft.test/logo.png");
  });
});
