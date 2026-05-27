import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActiveFilters } from "@/components/core/filters/ActiveFilters";

const meta: Meta<typeof ActiveFilters> = {
  title: "Core/Filters/ActiveFilters",
  component: ActiveFilters,
  args: {
    onRemoveFilter: () => {},
    onClearAll: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof ActiveFilters>;

export const Default: Story = {
  args: {
    filters: {
      statut: "actif",
      ville: "paris",
    },
    filterLabels: {
      statut: "Statut",
      ville: "Ville",
    },
    optionLabels: {
      statut_actif: "Actif",
      ville_paris: "Paris",
    },
  },
};

export const WithArrayValues: Story = {
  args: {
    filters: {
      statut: ["actif", "prospect"],
      typesBien: ["appartement", "maison"],
    },
    filterLabels: {
      statut: "Statut",
      typesBien: "Type de bien",
    },
    optionLabels: {
      statut_actif: "Actif",
      statut_prospect: "Prospect",
      typesBien_appartement: "Appartement",
      typesBien_maison: "Maison",
    },
  },
};

export const WithSpecialFormatting: Story = {
  args: {
    filters: {
      budgetMax: "500000",
      surfaceMin: "80",
    },
    filterLabels: {
      budgetMax: "Budget max",
      surfaceMin: "Surface min",
    },
  },
};

export const WithDate: Story = {
  args: {
    filters: {
      dateCreation: new Date("2024-06-15"),
      statut: "actif",
    },
    filterLabels: {
      dateCreation: "Date de création",
      statut: "Statut",
    },
    optionLabels: {
      statut_actif: "Actif",
    },
  },
};

export const ManyFilters: Story = {
  args: {
    filters: {
      statut: ["actif", "prospect"],
      ville: "paris",
      budgetMax: "400000",
      surfaceMin: "60",
      typesBien: ["appartement", "studio"],
    },
    filterLabels: {
      statut: "Statut",
      ville: "Ville",
      budgetMax: "Budget max",
      surfaceMin: "Surface min",
      typesBien: "Type de bien",
    },
    optionLabels: {
      statut_actif: "Actif",
      statut_prospect: "Prospect",
      ville_paris: "Paris",
      typesBien_appartement: "Appartement",
      typesBien_studio: "Studio",
    },
  },
};

export const Empty: Story = {
  args: {
    filters: {},
    // Note : le composant retourne null — rien ne s'affiche
  },
};
