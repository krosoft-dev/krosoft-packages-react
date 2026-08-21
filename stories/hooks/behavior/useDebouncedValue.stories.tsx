import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useDebouncedValue } from "@/hooks/behavior/useDebouncedValue";
import { SearchInput } from "@/components/core/inputs/SearchInput";

/**
 * Démo du hook useDebouncedValue : la valeur debouncée ne suit la saisie
 * qu'après une pause, ce qui évite une requête à chaque frappe.
 */
const UseDebouncedValueDemo = ({ delay = 500 }: { delay?: number }): React.ReactElement => {
  const [value, setValue] = React.useState("");
  const debounced = useDebouncedValue(value, delay);
  const requests = React.useRef(0);

  React.useEffect(() => {
    requests.current += 1;
  }, [debounced]);

  return (
    <div className="flex w-96 flex-col gap-4 p-8">
      <p className="text-sm text-muted-foreground">Tapez rapidement : la valeur debouncée n&apos;est mise à jour qu&apos;après {delay} ms sans frappe.</p>

      <SearchInput search={value} onSearch={setValue} placeholder="Rechercher..." />

      <div className="text-xs text-muted-foreground">
        <p>
          Saisie : <strong>{value === "" ? "—" : value}</strong>
        </p>
        <p>
          Debouncée : <strong>{debounced === "" ? "—" : debounced}</strong>
        </p>
        <p>
          Requêtes déclenchées : <strong>{requests.current}</strong>
        </p>
      </div>
    </div>
  );
};

const meta: Meta<typeof UseDebouncedValueDemo> = {
  title: "Hooks/useDebouncedValue",
  component: UseDebouncedValueDemo,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof UseDebouncedValueDemo>;

export const Default: Story = {};

/** Délai plus court, pour une recherche locale. */
export const ShortDelay: Story = {
  args: {
    delay: 150,
  },
};
