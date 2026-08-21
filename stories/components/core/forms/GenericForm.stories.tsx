import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { GenericForm } from "@/components/core/forms/GenericForm";
import { FormSchema } from "@/types";
import { User, Shield, Info } from "lucide-react";

interface DemoData {
  avatarUrl: string | null;
  username: string;
  email: string;
  age: number;
  bio: string;
  role: string;
  skills: string[];
  color: string;
  birthdate: string;
  preferredTime: string;
  acceptTerms: boolean;
}

const defaultInitialData: DemoData = {
  avatarUrl: null,
  username: "GuillaumeB",
  email: "guillaume@krosoft.com",
  age: 28,
  bio: "Développeur passionné par React et TypeScript.",
  role: "manager",
  skills: ["react", "typescript"],
  color: "#6366f1",
  birthdate: "1998-05-29",
  preferredTime: "09:00",
  acceptTerms: true,
};

const demoSchema: FormSchema<DemoData> = {
  sections: [
    {
      titleKey: "Profil Personnel",
      icon: User,
      iconClassName: "text-indigo-500",
      fields: [
        {
          key: "avatarUrl",
          labelKey: "Photo de profil",
          type: "image",
          hint: "Fichier image de type PNG ou JPG, max 2Mo",
          layout: { cols: 4 },
        },
        {
          key: "username",
          labelKey: "Nom d'utilisateur",
          type: "text",
          placeholderKey: "Entrez votre nom",
          rules: z => z.string().min(1, "Le nom d'utilisateur est requis").min(3, "Doit faire au moins 3 caractères"),
          layout: { cols: 2 },
        },
        {
          key: "email",
          labelKey: "Adresse E-mail",
          type: "text",
          placeholderKey: "votre.email@krosoft.com",
          rules: z =>
            z
              .string()
              .min(1, "L'e-mail est requis")
              .pipe(z.email({ message: "Format d'e-mail invalide" })),
          layout: { cols: 2 },
        },
        {
          key: "age",
          labelKey: "Âge",
          type: "number",
          placeholderKey: "Votre âge",
          min: 18,
          step: 1,
          rules: z => z.number().min(18, "Vous devez être majeur"),
          layout: { cols: 2 },
        },
        {
          key: "birthdate",
          labelKey: "Date de naissance",
          type: "date",
          rules: z => z.string().min(1, "La date est requise"),
          layout: { cols: 2 },
        },
        {
          key: "preferredTime",
          labelKey: "Heure de disponibilité",
          type: "time",
          layout: { cols: 2 },
        },
        {
          key: "bio",
          labelKey: "Biographie",
          type: "textarea",
          placeholderKey: "Dites-en un peu plus sur vous...",
          layout: { cols: 4 },
        },
      ],
    },
    {
      titleKey: "Préférences & Droits",
      icon: Shield,
      iconClassName: "text-emerald-500",
      fields: [
        {
          key: "role",
          labelKey: "Rôle de l'utilisateur",
          type: "select",
          options: [
            { value: "admin", label: "Administrateur", color: "#ef4444" },
            { value: "manager", label: "Manager", color: "#f59e0b" },
            { value: "user", label: "Utilisateur Standard", color: "#10b981" },
          ] as { value: string; label: string; color?: string }[],
          rules: z => z.string().min(1, "Le rôle est requis"),
          layout: { cols: 2 },
        },
        {
          key: "skills",
          labelKey: "Compétences clés",
          type: "multiSelect",
          options: [
            { value: "react", label: "React" },
            { value: "typescript", label: "TypeScript" },
            { value: "tailwind", label: "Tailwind CSS" },
            { value: "node", label: "Node.js" },
            { value: "nest", label: "NestJS" },
          ],
          defaultValue: [],
          layout: { cols: 2 },
        },
        {
          key: "color",
          labelKey: "Couleur de thème préférée",
          type: "color",
          defaultValue: "#6366f1",
          layout: { cols: 2 },
        },
        {
          key: "acceptTerms",
          labelKey: "J'accepte les conditions d'utilisation",
          type: "checkbox",
          rules: z => z.boolean().refine(val => val, "Vous devez accepter les conditions"),
          layout: { cols: 2 },
        },
      ],
    },
    {
      titleKey: "Informations Complémentaires",
      icon: Info,
      iconClassName: "text-blue-500",
      fields: [
        {
          key: "empty",
          type: "html",
          render: formValues => (
            <div className="p-4 bg-muted rounded-lg text-sm border flex flex-col gap-2">
              <span className="font-semibold text-foreground">Aperçu en temps réel :</span>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>
                  <strong>Nom d&apos;utilisateur :</strong> {formValues.username || "Non renseigné"}
                </li>
                <li>
                  <strong>Adresse E-mail :</strong> {formValues.email || "Non renseigné"}
                </li>
                <li>
                  <strong>Rôle sélectionné :</strong> {formValues.role || "Aucun"}
                </li>
                <li>
                  <strong>Compétences :</strong> {formValues.skills?.join(", ") || "Aucune"}
                </li>
              </ul>
            </div>
          ),
          layout: { cols: 4 },
        },
      ],
    },
  ],
};

const meta: Meta<typeof GenericForm> = {
  title: "Core/Forms/GenericForm",
  component: GenericForm,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "GenericForm est un composant permettant de générer des formulaires riches et responsifs à partir d'un schéma structuré. Il intègre de base la validation Zod avec react-hook-form, supporte les grilles multi-colonnes, la gestion par sections avec icônes ainsi que divers types d'inputs.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GenericForm>;

const FormWrapper = (props: React.ComponentProps<typeof GenericForm>): React.ReactElement => {
  const args = props as unknown as Omit<React.ComponentProps<typeof GenericForm>, "onSubmit"> & {
    onSubmit?: (data: DemoData) => void;
  };
  const [submittedData, setSubmittedData] = useState<DemoData | null>(null);

  return (
    <div className="w-[800px] max-w-full p-4 space-y-6">
      <GenericForm
        {...args}
        onSubmit={data => {
          void (async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const typedData = data as DemoData;
            setSubmittedData(typedData);
            args.onSubmit?.(typedData);
          })();
        }}
      />
      {submittedData && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
          <h4 className="font-semibold mb-2">Données soumises avec succès :</h4>
          <pre className="text-xs overflow-auto max-h-48 p-2 bg-emerald-100 rounded">{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export const DefaultWithCards: Story = {
  render: FormWrapper,
  args: {
    schema: demoSchema as unknown as FormSchema<unknown>,
    initialData: defaultInitialData,
  },
};

export const WithoutCardsLayout: Story = {
  render: FormWrapper,
  args: {
    schema: {
      ...demoSchema,
      useCards: false,
    } as unknown as FormSchema<unknown>,
    initialData: defaultInitialData,
  },
};

export const EmptyFormWithValidation: Story = {
  render: FormWrapper,
  args: {
    schema: demoSchema as unknown as FormSchema<unknown>,
    initialData: undefined,
  },
};

export const DisabledForm: Story = {
  render: FormWrapper,
  args: {
    schema: demoSchema as unknown as FormSchema<unknown>,
    initialData: defaultInitialData,
    disabled: true,
  },
};

export const NullSchema: Story = {
  render: FormWrapper,
  args: {
    schema: null,
  },
};
