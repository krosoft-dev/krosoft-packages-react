import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppDialog } from "../../../../src/components/core/dialogs/AppDialog";

afterEach(() => {
  cleanup();
});

const renderDialog = (props: Partial<React.ComponentProps<typeof AppDialog>> = {}): { onOpenChange: (open: boolean) => void } => {
  const onOpenChange = vi.fn();
  render(
    <AppDialog open onOpenChange={onOpenChange} config={{ title: "Titre" }} {...props}>
      <p>Contenu</p>
    </AppDialog>,
  );

  return { onOpenChange };
};

describe("AppDialog — pied de dialog", () => {
  it("rend les actions et transmet leur className", async () => {
    const onClick = vi.fn();
    renderDialog({ config: { title: "Titre", actions: [{ label: "Valider", onClick, className: "w-full" }] } });

    const button = screen.getByRole("button", { name: "Valider" });
    expect(button.className).toContain("w-full");

    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("soumet un formulaire du contenu via une action `submit`", async () => {
    const onSubmit = vi.fn((e: React.SyntheticEvent) => {
      e.preventDefault();
    });
    render(
      <AppDialog open onOpenChange={() => {}} config={{ title: "Titre", actions: [{ label: "Enregistrer", type: "submit", form: "edition" }] }}>
        <form id="edition" onSubmit={onSubmit} />
      </AppDialog>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Enregistrer" }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("laisse un footer libre prendre le pas sur les actions", () => {
    renderDialog({ config: { title: "Titre", actions: [{ label: "Valider", onClick: () => {} }] }, footer: <span>Pied maison</span> });

    expect(screen.getByText("Pied maison")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Valider" })).toBeNull();
  });
});

// Fermer pendant un envoi laisserait l'utilisateur sans retour sur ce qui est parti :
// la dialog se verrouille, et seule une action marquée `disableOnLoading: false` reste
// atteignable — sans quoi un envoi long enfermerait l'utilisateur dans la dialog.
describe("AppDialog — chargement", () => {
  it("verrouille la fermeture", async () => {
    const { onOpenChange } = renderDialog({ isLoading: true });

    await userEvent.keyboard("{Escape}");
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("laisse fermer hors chargement", async () => {
    const { onOpenChange } = renderDialog();

    await userEvent.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("désactive les actions, sauf celles qui s'en excluent", () => {
    renderDialog({
      isLoading: true,
      config: {
        title: "Titre",
        actions: [
          { label: "Enregistrer", onClick: () => {} },
          { label: "Annuler", onClick: () => {}, disableOnLoading: false },
        ],
      },
    });

    expect(screen.getByRole("button", { name: "Enregistrer" })).toHaveProperty("disabled", true);
    expect(screen.getByRole("button", { name: "Annuler" })).toHaveProperty("disabled", false);
  });
});

describe("AppDialog — largeur", () => {
  it("applique la taille demandée", () => {
    renderDialog({ config: { title: "Titre", size: "2xl" } });

    expect(screen.getByRole("dialog").className).toContain("sm:max-w-2xl");
  });

  it("laisse `maxWidth` déroger à la taille", () => {
    renderDialog({ config: { title: "Titre", size: "2xl", maxWidth: "sm:max-w-4xl" } });

    const classes = screen.getByRole("dialog").className;
    expect(classes).toContain("sm:max-w-4xl");
    expect(classes).not.toContain("sm:max-w-2xl");
  });
});

// L'en-tête a ses propres tokens : une application qui déplace `--k-brand-*` pour un
// bandeau ou un écran de connexion ne doit pas voir bouger ses dialogs.
describe("AppDialog — en-tête", () => {
  it("s'habille des tokens d'en-tête, pas de ceux de la marque", () => {
    renderDialog({ config: { title: "Titre", icon: () => <span /> } });

    // Le titre est un <h2> : le premier div au-dessus est l'en-tête.
    const classes = screen.getByText("Titre").closest("div")?.className ?? "";

    expect(classes).toContain("from-dialog-header-from");
    expect(classes).toContain("to-dialog-header-to");
    expect(classes).not.toContain("brand");
  });
});

describe("AppDialog — erreur", () => {
  it("affiche le message d'une Error", () => {
    renderDialog({ error: new Error("Connexion perdue") });

    expect(screen.getByText("Connexion perdue")).toBeTruthy();
  });

  it("affiche le code et les détails d'une ErrorHttp", () => {
    renderDialog({ error: { code: 422, message: "Requête invalide", errors: ["Le libellé est obligatoire"] } });

    expect(screen.getByText("422")).toBeTruthy();
    expect(screen.getByText("Le libellé est obligatoire")).toBeTruthy();
  });
});
