import { cleanup, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { AppDialog } from "../../../src/components/core/dialogs/AppDialog";
import { Dialog, DialogContent, DialogTitle } from "../../../src/components/ui/dialog";

afterEach(() => {
  cleanup();
});

const dialogClasses = (): string[] => screen.getByRole("dialog").className.split(/\s+/);

// Sur mobile une dialog centrée ne laissait qu'une bande étroite au contenu : les
// formulaires y étaient illisibles. Le gabarit part donc du plein écran, et ne
// redevient une dialog centrée qu'à partir de `sm`.
describe("gabarit des dialogs", () => {
  it("occupe tout l'écran sur mobile et redevient centrée dès sm", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Titre</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(dialogClasses()).toEqual(expect.arrayContaining(["max-w-none", "h-[100dvh]", "max-h-[100dvh]", "rounded-none"]));
    expect(dialogClasses()).toEqual(expect.arrayContaining(["sm:h-auto", "sm:max-h-[95vh]", "sm:max-w-lg", "sm:rounded-surface"]));
  });

  it("laisse le consommateur déroger au plein écran", () => {
    render(
      <Dialog open>
        <DialogContent className="h-auto max-h-[95vh] rounded-surface">
          <DialogTitle>Titre</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    const classes = dialogClasses();

    expect(classes).toEqual(expect.arrayContaining(["h-auto", "max-h-[95vh]", "rounded-surface"]));
    expect(classes).not.toContain("h-[100dvh]");
    expect(classes).not.toContain("max-h-[100dvh]");
  });

  it("applique le plein écran mobile à AppDialog", () => {
    render(
      <AppDialog open onOpenChange={() => {}} config={{ title: "Nouveau média" }}>
        <p>Contenu</p>
      </AppDialog>,
    );

    const classes = dialogClasses();

    expect(classes).toEqual(expect.arrayContaining(["h-[100dvh]", "rounded-none"]));
    // La largeur par défaut d'AppDialog ne s'applique qu'à partir de `sm`.
    expect(classes).toContain("sm:max-w-xl");
  });
});
