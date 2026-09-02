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
 * Le dégradé d'un thème, sur les deux surfaces qui le portent : l'en-tête d'`AppDialog`
 * et le bouton `brand`. L'en-tête est reproduit plutôt qu'ouvert en vraie dialog — une
 * dialog part en portal dans `body` et prendrait le thème global, pas celui du bloc.
 */
const Echantillon = ({ label, className }: { label: string; className: string }): React.JSX.Element => (
  <div className={`${className} rounded-surface border border-border bg-background text-foreground overflow-hidden`}>
    <div className="bg-gradient-to-r from-brand-from to-brand-to p-4">
      <div className="flex items-center gap-2 text-brand-foreground">
        <div className="p-2 bg-brand-foreground/20 rounded-control">
          <SparklesIcon className="size-4" />
        </div>
        <span className="text-xl font-bold">{label}</span>
      </div>
      <p className="text-brand-foreground/80 text-sm mt-1">En-tête d&apos;AppDialog : titre, icône et description suivent `--k-brand-foreground`.</p>
    </div>

    <div className="p-4 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="brand">Action de marque</Button>
        <Button variant="default">Bouton primaire</Button>
        <Button variant="outline">Bouton secondaire</Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <Pastille classe="bg-brand-from" nom="--k-brand-from" />
        <Pastille classe="bg-brand-to" nom="--k-brand-to" />
        <Pastille classe="bg-brand-foreground" nom="--k-brand-foreground" />
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
          "Le dégradé de marque (`--k-brand-from`, `--k-brand-to`, `--k-brand-foreground`) habille l'en-tête d'`AppDialog` et le bouton `variant=\"brand\"`. " +
          "Chaque thème embarqué le redéclare avec ses propres teintes : le foreground n'est donc pas toujours blanc — un dégradé clair demande un texte sombre.",
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
