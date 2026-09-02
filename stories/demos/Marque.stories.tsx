import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { AppDialog } from "@/components/core/dialogs";
import { Button } from "@/components/ui";
import { SparklesIcon } from "lucide-react";
import { DEMO_THEME_OPTIONS } from "../constants/themes";

/** Les thèmes embarqués, moins « Automatique » qui se contente de suivre le système. */
const THEMES = DEMO_THEME_OPTIONS.filter(option => option.value !== "system").map(option => ({
  label: option.label,
  // Le thème clair est le socle `:root` : aucune classe à poser.
  className: option.value === "light" ? "" : option.value,
}));

/** Une pastille par borne du dégradé, pour lire les trois tokens d'un coup d'œil. */
const Pastille = ({ classe, nom }: { classe: string; nom: string }): React.JSX.Element => (
  <div className="flex items-center gap-2">
    <span className={`size-5 rounded-control border border-border ${classe}`} />
    <code className="text-xs text-muted-foreground">{nom}</code>
  </div>
);

/**
 * Les deux dégradés d'un thème : `--k-dialog-header-*` sur l'en-tête d'`AppDialog`,
 * `--k-brand-*` sur le bouton `brand`. Ils partent des mêmes teintes dans les thèmes
 * embarqués, mais rien ne les lie : une application peut déplacer sa marque sans
 * toucher aux dialogs. L'en-tête est reproduit plutôt qu'ouvert en vraie dialog — une
 * dialog part en portal dans `body` et prendrait le thème global, pas celui du bloc.
 */
const Echantillon = ({ label, className }: { label: string; className: string }): React.JSX.Element => (
  <div className={`${className} rounded-surface border border-border bg-background text-foreground overflow-hidden`}>
    <div className="bg-gradient-to-r from-dialog-header-from to-dialog-header-to p-4">
      <div className="flex items-center gap-2 text-dialog-header-foreground">
        <div className="p-2 bg-dialog-header-foreground/20 rounded-control">
          <SparklesIcon className="size-4" />
        </div>
        <span className="text-xl font-bold">{label}</span>
      </div>
      <p className="text-dialog-header-foreground/80 text-sm mt-1">En-tête d&apos;AppDialog — `--k-dialog-header-*`.</p>
    </div>

    <div className="p-4 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="brand">Action de marque</Button>
        <Button variant="default">Bouton primaire</Button>
        <Button variant="outline">Bouton secondaire</Button>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-4">
          <Pastille classe="bg-brand-from" nom="--k-brand-from" />
          <Pastille classe="bg-brand-to" nom="--k-brand-to" />
          <Pastille classe="bg-brand-foreground" nom="--k-brand-foreground" />
        </div>
        <div className="flex flex-wrap gap-4">
          <Pastille classe="bg-dialog-header-from" nom="--k-dialog-header-from" />
          <Pastille classe="bg-dialog-header-to" nom="--k-dialog-header-to" />
          <Pastille classe="bg-dialog-header-foreground" nom="--k-dialog-header-foreground" />
        </div>
      </div>
    </div>
  </div>
);

const meta: Meta = {
  title: "Design Tokens/Marque",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Deux dégradés distincts : `--k-brand-*` pour la marque de l'application (bouton `variant=\"brand\"`, bandeaux) et `--k-dialog-header-*` pour l'en-tête d'`AppDialog`. " +
          "Ils partent des mêmes teintes dans les thèmes embarqués mais rien ne les lie — déplacer la marque ne touche pas les dialogs. " +
          "Chaque thème les redéclare : le foreground n'est donc pas toujours blanc, un dégradé clair demande un texte sombre.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Comparaison: Story = {
  render: () => (
    <div className="grid gap-6 p-4 lg:grid-cols-2">
      {THEMES.map(theme => (
        <Echantillon key={theme.label} label={theme.label} className={theme.className} />
      ))}
    </div>
  ),
};

/** Le rendu réel, dans une dialog : le thème vient du sélecteur de la barre d'outils. */
const DialogDemo = (): React.JSX.Element => {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <Button
        variant="brand"
        onClick={(): void => {
          setOpen(true);
        }}
      >
        Ouvrir la dialog
      </Button>
      <AppDialog
        open={open}
        onOpenChange={setOpen}
        config={{
          title: "Dégradé de marque",
          description: "Bascule de thème dans la barre d'outils pour comparer.",
          icon: SparklesIcon,
          actions: [
            {
              label: "Annuler",
              onClick: (): void => {
                setOpen(false);
              },
              variant: "outline",
            },
            {
              label: "Confirmer",
              onClick: (): void => {
                setOpen(false);
              },
              variant: "brand",
            },
          ],
        }}
      >
        <p className="text-sm text-muted-foreground">L&apos;en-tête, la croix de fermeture et le bouton de confirmation partagent les mêmes tokens.</p>
      </AppDialog>
    </div>
  );
};

export const DansUneDialog: Story = {
  name: "Dans une dialog",
  render: () => <DialogDemo />,
};
