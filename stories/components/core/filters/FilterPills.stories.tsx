import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { CheckCircle, Circle, Clock, Film, Tv } from "lucide-react";
import { FilterPills, type FilterPillsProps } from "@/components/core/filters/FilterPills";
import type { FilterPillOption } from "@/components/core/filters/FilterPillsGroup";

// Wrapper pour résoudre le type générique avec Storybook
const FilterPillsString = (props: FilterPillsProps<string>): React.ReactElement => <FilterPills<string> {...props} />;

const STATUTS: FilterPillOption<string>[] = [
  { value: "tous", label: "Tous" },
  { value: "a-traiter", label: "À traiter" },
  { value: "traites", label: "Traités" },
];

const STATUTS_AVEC_COMPTEURS: FilterPillOption<string>[] = [
  { value: "tous", label: "Tous", count: 10 },
  { value: "a-traiter", label: "À traiter", count: 3 },
  { value: "traites", label: "Traités", count: 7 },
];

const STATUTS_AVEC_ICONES: FilterPillOption<string>[] = [
  { value: "tous", label: "Tous", icon: Circle },
  { value: "a-traiter", label: "À traiter", icon: Clock },
  { value: "traites", label: "Traités", icon: CheckCircle },
];

const STATUTS_COLORES: FilterPillOption<string>[] = [
  { value: "tous", label: "Tous" },
  { value: "disponible", label: "Disponible", count: 4, className: "border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400" },
  { value: "reserve", label: "Réservé", count: 2, className: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { value: "vendu", label: "Vendu", count: 6, className: "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400" },
];

const TYPES: FilterPillOption<string>[] = [
  { value: "tous", label: "Tous" },
  { value: "films", label: "Films", icon: Film },
  { value: "series", label: "Séries", icon: Tv },
  { value: "animations", label: "Animations" },
];

const meta: Meta<typeof FilterPillsString> = {
  title: "Core/Filters/FilterPills",
  component: FilterPillsString,
  args: {
    options: STATUTS,
    value: "tous",
    onChange: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof FilterPillsString>;

export const Default: Story = {};

export const WithCounts: Story = {
  args: {
    options: STATUTS_AVEC_COMPTEURS,
    value: "a-traiter",
  },
};

export const WithIcons: Story = {
  args: {
    options: STATUTS_AVEC_ICONES,
    value: "traites",
  },
};

export const Outline: Story = {
  args: {
    options: STATUTS_AVEC_COMPTEURS,
    value: "a-traiter",
    variant: "outline",
  },
};

export const WithColors: Story = {
  args: {
    options: STATUTS_COLORES,
    value: "disponible",
  },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState("tous");
    return (
      <div className="space-y-4">
        <FilterPills<string> options={STATUTS_AVEC_COMPTEURS} value={value} onChange={setValue} />
        <p className="text-xs text-muted-foreground">Statut sélectionné : {value}</p>
      </div>
    );
  },
};

export const MultipleGroups: Story = {
  render: () => {
    const [statut, setStatut] = useState("tous");
    const [type, setType] = useState("animations");
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Statut</p>
            <FilterPills<string> options={STATUTS} value={statut} onChange={setStatut} variant="outline" />
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Type</p>
            <FilterPills<string> options={TYPES} value={type} onChange={setType} variant="outline" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Statut : {statut} · Type : {type}
        </p>
      </div>
    );
  },
};
