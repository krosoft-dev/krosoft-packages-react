import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FilterField } from "@/components/core/filters/FilterField";
import type { FilterFieldConfig } from "@/types/FilterFieldConfig";
import type { DateRange } from "react-day-picker";

const meta: Meta<typeof FilterField> = {
  title: "Core/Filters/FilterField",
  component: FilterField,
  decorators: [
    Story => (
      <div className="w-72 pb-72">
        <Story />
      </div>
    ),
  ],
  args: {
    onChange: () => {},
    onToggleMultiSelect: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof FilterField>;

export const TypeText: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const field: FilterFieldConfig = { key: "nom", labelKey: "Nom", type: "text", placeholder: "Rechercher par nom..." };
    return <FilterField field={field} value={value} onChange={v => setValue(v as string)} onToggleMultiSelect={() => {}} />;
  },
};

export const TypeNumber: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const field: FilterFieldConfig = { key: "budget", labelKey: "Budget", type: "number", placeholder: "0", min: 0, max: 1000000 };
    return <FilterField field={field} value={value} onChange={v => setValue(v as string)} onToggleMultiSelect={() => {}} />;
  },
};

export const TypeSelect: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const field: FilterFieldConfig = {
      key: "statut",
      labelKey: "Statut",
      type: "select",
      placeholder: "Tous les statuts",
      options: [
        { value: "actif", label: "Actif" },
        { value: "inactif", label: "Inactif" },
        { value: "prospect", label: "Prospect" },
      ],
    };
    return <FilterField field={field} value={value} onChange={v => setValue(v as string)} onToggleMultiSelect={() => {}} />;
  },
};

export const TypeSelectSearchable: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined);
    const field: FilterFieldConfig = {
      key: "pays",
      labelKey: "Pays",
      type: "select",
      placeholder: "Sélectionner un pays",
      searchable: true,
      searchPlaceholder: "Rechercher un pays...",
      options: [
        { value: "fr", label: "France" },
        { value: "be", label: "Belgique" },
        { value: "ch", label: "Suisse" },
        { value: "de", label: "Allemagne" },
        { value: "es", label: "Espagne" },
        { value: "it", label: "Italie" },
      ],
    };
    return <FilterField field={field} value={value} onChange={v => setValue(v as string)} onToggleMultiSelect={() => {}} />;
  },
};

export const TypeDate: Story = {
  render: () => {
    const [value, setValue] = useState<Date | undefined>(undefined);
    const field: FilterFieldConfig = { key: "dateCreation", labelKey: "Date de création", type: "date", placeholder: "Sélectionner une date" };
    return <FilterField field={field} value={value} onChange={v => setValue(v as Date)} onToggleMultiSelect={() => {}} />;
  },
};

export const TypeDateRange: Story = {
  render: () => {
    const [value, setValue] = useState<DateRange | undefined>(undefined);
    const field: FilterFieldConfig = { key: "periode", labelKey: "Période", type: "date-range", placeholder: "Sélectionner une période" };
    return <FilterField field={field} value={value} onChange={v => setValue(v as DateRange)} onToggleMultiSelect={() => {}} />;
  },
};

export const TypeMultiSelect: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    const toggle = (v: string): void => {
      setValue(prev => (prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]));
    };
    const field: FilterFieldConfig = {
      key: "villes",
      labelKey: "Villes",
      type: "multi-select",
      placeholder: "Toutes les villes",
      options: [
        { value: "paris", label: "Paris" },
        { value: "lyon", label: "Lyon" },
        { value: "marseille", label: "Marseille" },
        { value: "bordeaux", label: "Bordeaux" },
        { value: "nice", label: "Nice" },
      ],
    };
    return <FilterField field={field} value={value} onChange={v => setValue(v as string[])} onToggleMultiSelect={toggle} />;
  },
};

export const TypeMultiSelectSearchable: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    const toggle = (v: string): void => {
      setValue(prev => (prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]));
    };
    const field: FilterFieldConfig = {
      key: "villes",
      labelKey: "Villes",
      type: "multi-select",
      placeholder: "Toutes les villes",
      searchable: true,
      searchPlaceholder: "Rechercher une ville...",
      options: [
        { value: "paris", label: "Paris" },
        { value: "lyon", label: "Lyon" },
        { value: "marseille", label: "Marseille" },
        { value: "bordeaux", label: "Bordeaux" },
        { value: "nice", label: "Nice" },
        { value: "toulouse", label: "Toulouse" },
        { value: "nantes", label: "Nantes" },
        { value: "strasbourg", label: "Strasbourg" },
      ],
    };
    return <FilterField field={field} value={value} onChange={v => setValue(v as string[])} onToggleMultiSelect={toggle} />;
  },
};

export const AllTypes: Story = {
  render: () => {
    const [text, setText] = useState("");
    const [number, setNumber] = useState("");
    const [select, setSelect] = useState("");
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [multi, setMulti] = useState<string[]>([]);

    const OPTIONS = [
      { value: "actif", label: "Actif" },
      { value: "inactif", label: "Inactif" },
      { value: "prospect", label: "Prospect" },
    ];

    return (
      <div className="w-72 space-y-4 pb-72">
        {[
          {
            label: "Texte",
            el: (
              <FilterField
                field={{ key: "t", labelKey: "Texte", type: "text", placeholder: "..." }}
                value={text}
                onChange={v => setText(v as string)}
                onToggleMultiSelect={() => {}}
              />
            ),
          },
          {
            label: "Nombre",
            el: (
              <FilterField
                field={{ key: "n", labelKey: "Nombre", type: "number", placeholder: "0" }}
                value={number}
                onChange={v => setNumber(v as string)}
                onToggleMultiSelect={() => {}}
              />
            ),
          },
          {
            label: "Select",
            el: (
              <FilterField
                field={{ key: "s", labelKey: "Select", type: "select", placeholder: "Choisir", options: OPTIONS }}
                value={select}
                onChange={v => setSelect(v as string)}
                onToggleMultiSelect={() => {}}
              />
            ),
          },
          {
            label: "Date",
            el: (
              <FilterField
                field={{ key: "d", labelKey: "Date", type: "date", placeholder: "Sélectionner" }}
                value={date}
                onChange={v => setDate(v as Date)}
                onToggleMultiSelect={() => {}}
              />
            ),
          },
          {
            label: "Multi-select",
            el: (
              <FilterField
                field={{ key: "m", labelKey: "Multi", type: "multi-select", placeholder: "Choisir", options: OPTIONS }}
                value={multi}
                onChange={v => setMulti(v as string[])}
                onToggleMultiSelect={v => setMulti(prev => (prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]))}
              />
            ),
          },
        ].map(({ label, el }) => (
          <div key={label}>
            <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
            {el}
          </div>
        ))}
      </div>
    );
  },
};
