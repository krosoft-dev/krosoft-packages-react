import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import FormDialog, { FormDialogProps } from "@/components/core/dialogs/FormDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Clock } from "lucide-react";
import type { FormSchema } from "@/types";

const meta: Meta<typeof FormDialog> = {
  title: "Core/Dialogs/FormDialog",
  component: FormDialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "FormDialog est un composant de dialogue avancé qui permet d'afficher et d'éditer des données structurées. Il supporte un mode vue (lecture seule) et un mode édition, des rendus personnalisés, des sections multiples et des en-têtes/pieds-de-page modulables.",
      },
    },
  },
};

export default meta;

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

type Story = StoryObj<FormDialogProps<UserProfile>>;

const mockUser: UserProfile = {
  id: "USR-001",
  firstName: "Guillaume",
  lastName: "Bertrand",
  email: "guillaume@example.com",
  role: "Administrateur",
  status: "Actif",
  lastLogin: "Il y a 2 heures",
};

const defaultSchema: FormSchema<UserProfile> = {
  useCards: false,
  sections: [
    {
      titleKey: "Informations personnelles",
      icon: User,
      fields: [
        { key: "firstName", labelKey: "Prénom", type: "text", layout: { cols: 2 } },
        { key: "lastName", labelKey: "Nom", type: "text", layout: { cols: 2 } },
        { key: "email", labelKey: "Adresse e-mail", type: "text", layout: { cols: 4 } },
      ],
    },
    {
      titleKey: "Accès & Rôle",
      icon: Shield,
      fields: [
        { key: "role", labelKey: "Rôle", type: "text", layout: { cols: 2 } },
        { key: "status", labelKey: "Statut", type: "text", layout: { cols: 2 } },
      ],
    },
  ],
};

const ModalWrapper = (args: FormDialogProps<UserProfile>): React.ReactElement => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<UserProfile>(mockUser);

  const { open: _open, onOpenChange: _onOpenChange, data: _data, onSave: _onSave, ...restArgs } = args;

  return (
    <div>
      <Button
        onClick={(): void => {
          setOpen(true);
        }}
      >
        Ouvrir le formulaire
      </Button>
      <FormDialog<UserProfile>
        {...restArgs}
        open={open}
        onOpenChange={setOpen}
        data={data}
        onSave={async (editedData: UserProfile): Promise<void> => {
          // Simulation d'un appel API avec délai
          await new Promise(resolve => {
            setTimeout(resolve, 1000);
          });
          setData(editedData);
        }}
      />
    </div>
  );
};

export const Default: Story = {
  render: ModalWrapper,
  args: {
    title: (data: UserProfile): string => `Profil de ${data.firstName} ${data.lastName}`,
    schema: defaultSchema,
  },
};

export const WithHeaderBadge: Story = {
  render: ModalWrapper,
  args: {
    title: (data: UserProfile): string => `Édition utilisateur: ${data.id}`,
    headerBadge: (data: UserProfile): React.ReactNode => (
      <Badge variant={data.status === "Actif" ? "default" : "destructive"}>{data.status === "Actif" ? "Compte Actif" : "Compte Suspendu"}</Badge>
    ),
    schema: defaultSchema,
  },
};

export const CustomFooter: Story = {
  render: ModalWrapper,
  args: {
    title: (data: UserProfile): string => `Aperçu détaillé: ${data.firstName}`,
    schema: defaultSchema,
    customFooter: (data: UserProfile): React.ReactNode => (
      <div className="mt-8 p-4 bg-orange-50 border border-orange-100 rounded-lg flex items-start gap-3">
        <Clock className="size-5 text-orange-500 shrink-0 mt-0.5" />
        <div className="text-sm text-orange-800">
          <p className="font-semibold">Dernière connexion enregistrée : {data.lastLogin}</p>
          <p>Toute modification apportée à ce profil sera notifiée à l&apos;utilisateur par e-mail.</p>
        </div>
      </div>
    ),
  },
};

export const DefaultEditingMode: Story = {
  render: ModalWrapper,
  args: {
    title: (): string => `Création d'un nouvel utilisateur`,
    schema: defaultSchema,
    defaultEditing: true,
    saveLabel: "Créer l'utilisateur",
    cancelLabel: "Annuler",
  },
};

const customRenderSchema: FormSchema<UserProfile> = {
  useCards: false,
  sections: [
    ...defaultSchema.sections,
    {
      titleKey: "Activité",
      icon: Clock,
      fields: [
        {
          key: "empty",
          type: "html",
          labelKey: "Dernière connexion",
          layout: { cols: 4 },
          render: formValues => (
            <div className="w-full">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100 flex items-center gap-2 font-medium mb-2">
                <Clock className="size-4" />
                {formValues.lastLogin}
              </div>
              <div className="p-4 bg-gray-100 rounded-md text-sm text-gray-500 text-center italic">
                Ce champ est généré automatiquement par le système et ne peut pas être modifié manuellement.
              </div>
            </div>
          ),
        },
      ],
    },
  ],
};

export const AdvancedCustomRendering: Story = {
  render: ModalWrapper,
  args: {
    title: (data: UserProfile): string => `Profil avancé de ${data.firstName}`,
    schema: customRenderSchema,
  },
};
