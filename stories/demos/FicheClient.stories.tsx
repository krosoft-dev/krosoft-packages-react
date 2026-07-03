import type { Meta, StoryObj } from "@storybook/react-vite";
import { BriefcaseIcon, MapPinIcon, UserIcon } from "lucide-react";
import React, { useState } from "react";
import { GenericForm } from "@/components/core/forms/GenericForm";
import { Badge } from "@/components/ui/badge";
import type { FormSchema } from "@/types";

// --- Modèle de la fiche client ----------------------------------------------

interface FicheClient {
  nom: string;
  email: string;
  telephone: string;
  statut: string;
  secteur: string;
  ville: string;
  adresse: string;
  budget: number;
  dateEntree: string;
  commercial: string;
  tags: string[];
  notes: string;
  newsletter: boolean;
}

const DONNEES_INITIALES: FicheClient = {
  nom: "Groupe Lumière SA",
  email: "contact@groupe-lumiere.fr",
  telephone: "01 23 45 67 89",
  statut: "prospect",
  secteur: "tech",
  ville: "lyon",
  adresse: "12 rue de la République",
  budget: 150_000,
  dateEntree: "2024-03-15",
  commercial: "marie.dupont",
  tags: ["strategique"],
  notes: "Premier contact via salon professionnel. Fort potentiel sur l'offre entreprise.",
  newsletter: true,
};

// --- Schéma du formulaire ----------------------------------------------------

const schema: FormSchema<FicheClient> = {
  sections: [
    {
      titleKey: "Identité",
      icon: UserIcon,
      iconClassName: "text-indigo-500",
      fields: [
        {
          key: "nom",
          labelKey: "Raison sociale",
          type: "text",
          placeholderKey: "Nom de l'entreprise",
          rules: z => z.string().min(1, "La raison sociale est requise").min(3, "Au moins 3 caractères"),
          layout: { cols: 2 },
        },
        {
          key: "statut",
          labelKey: "Statut",
          type: "select",
          options: [
            { value: "prospect", label: "Prospect", color: "#f59e0b" },
            { value: "actif", label: "Actif", color: "#10b981" },
            { value: "inactif", label: "Inactif", color: "#6b7280" },
            { value: "archive", label: "Archivé", color: "#ef4444" },
          ] as { value: string; label: string; color?: string }[],
          rules: z => z.string().min(1, "Le statut est requis"),
          layout: { cols: 2 },
        },
        {
          key: "email",
          labelKey: "E-mail",
          type: "text",
          placeholderKey: "contact@entreprise.fr",
          rules: z =>
            z
              .string()
              .min(1, "L'e-mail est requis")
              .pipe(z.email({ message: "Format d'e-mail invalide" })),
          layout: { cols: 2 },
        },
        {
          key: "telephone",
          labelKey: "Téléphone",
          type: "text",
          placeholderKey: "01 23 45 67 89",
          layout: { cols: 2 },
        },
      ],
    },
    {
      titleKey: "Localisation",
      icon: MapPinIcon,
      iconClassName: "text-blue-500",
      fields: [
        {
          key: "ville",
          labelKey: "Ville",
          type: "select",
          options: [
            { value: "paris", label: "Paris" },
            { value: "lyon", label: "Lyon" },
            { value: "marseille", label: "Marseille" },
            { value: "bordeaux", label: "Bordeaux" },
            { value: "nice", label: "Nice" },
            { value: "toulouse", label: "Toulouse" },
          ],
          rules: z => z.string().min(1, "La ville est requise"),
          layout: { cols: 2 },
        },
        {
          key: "adresse",
          labelKey: "Adresse",
          type: "text",
          placeholderKey: "N° et nom de rue",
          layout: { cols: 2 },
        },
      ],
    },
    {
      titleKey: "Qualification commerciale",
      icon: BriefcaseIcon,
      iconClassName: "text-emerald-500",
      fields: [
        {
          key: "secteur",
          labelKey: "Secteur d'activité",
          type: "select",
          options: [
            { value: "tech", label: "Tech" },
            { value: "finance", label: "Finance" },
            { value: "sante", label: "Santé" },
            { value: "industrie", label: "Industrie" },
            { value: "retail", label: "Retail" },
          ],
          rules: z => z.string().min(1, "Le secteur est requis"),
          layout: { cols: 2 },
        },
        {
          key: "commercial",
          labelKey: "Commercial référent",
          type: "select",
          options: [
            { value: "marie.dupont", label: "Marie Dupont" },
            { value: "julien.martin", label: "Julien Martin" },
            { value: "sophie.bernard", label: "Sophie Bernard" },
          ],
          layout: { cols: 2 },
        },
        {
          key: "budget",
          labelKey: "Budget estimé (€)",
          type: "number",
          placeholderKey: "0",
          min: 0,
          step: 1000,
          rules: z => z.number().min(0, "Le budget doit être positif"),
          layout: { cols: 2 },
        },
        {
          key: "dateEntree",
          labelKey: "Date d'entrée en portefeuille",
          type: "date",
          rules: z => z.string().min(1, "La date est requise"),
          layout: { cols: 2 },
        },
        {
          key: "tags",
          labelKey: "Étiquettes",
          type: "multiSelect",
          options: [
            { value: "strategique", label: "Stratégique" },
            { value: "grand-compte", label: "Grand compte" },
            { value: "recurrent", label: "Récurrent" },
            { value: "a-relancer", label: "À relancer" },
          ],
          defaultValue: [],
          layout: { cols: 4 },
        },
        {
          key: "notes",
          labelKey: "Notes internes",
          type: "textarea",
          placeholderKey: "Contexte, historique, prochaines étapes...",
          layout: { cols: 4 },
        },
        {
          key: "newsletter",
          labelKey: "Abonner ce client à la newsletter commerciale",
          type: "checkbox",
          layout: { cols: 4 },
        },
      ],
    },
  ],
};

// --- Page de démonstration ---------------------------------------------------

const FicheClientPage = (initialData?: FicheClient): React.JSX.Element => {
  const [enregistre, setEnregistre] = useState<FicheClient | null>(null);
  const estEdition = initialData !== undefined;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-lg bg-blue-100">
          <BriefcaseIcon className="size-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{estEdition ? "Modifier la fiche client" : "Nouveau client"}</h1>
          <p className="text-sm text-muted-foreground">
            Démo d&apos;une page de formulaire applicative : sections, validation Zod, grille responsive et retour de soumission.
          </p>
        </div>
      </div>

      <GenericForm<FicheClient>
        schema={schema}
        initialData={initialData}
        onCancel={() => {
          setEnregistre(null);
        }}
        onSubmit={data => {
          void (async () => {
            await new Promise(resolve => setTimeout(resolve, 800));
            setEnregistre(data);
          })();
        }}
      />

      {enregistre !== null && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="default">Enregistré</Badge>
            <span className="font-semibold">{enregistre.nom}</span>
          </div>
          <pre className="max-h-56 overflow-auto rounded bg-emerald-100 p-2 text-xs dark:bg-emerald-900/40">{JSON.stringify(enregistre, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

const meta: Meta = {
  title: "Démos/Fiche client",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Story de démonstration illustrant une **page de formulaire** applicative complète, construite avec `GenericForm`. Sections à icônes, validation Zod, disposition en grille responsive et affichage du résultat après soumission — dans la continuité de la démo « Portefeuille clients ».",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Creation: Story = {
  name: "Création",
  render: () => FicheClientPage(),
};

export const Edition: Story = {
  name: "Édition",
  render: () => FicheClientPage(DONNEES_INITIALES),
};
