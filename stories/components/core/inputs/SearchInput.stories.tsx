import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SearchInput } from "@/components/core/inputs/SearchInput";
import { Button } from "@/components/ui/button";
import { FilterXIcon } from "lucide-react";

const meta: Meta<typeof SearchInput> = {
  title: "Core/Inputs/SearchInput",
  component: SearchInput,
  args: {
    placeholder: "Rechercher...",
    searchQuery: "",
  },
  argTypes: {
    placeholder: {
      control: "text",
    },
    searchQuery: {
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: {
    onSearch: (value: string) => {
      console.warn("search:", value);
    },
  },
};

export const WithValue: Story = {
  args: {
    searchQuery: "krosoft",
    onSearch: (value: string) => {
      console.warn("search:", value);
    },
  },
};

export const WithSubmit: Story = {
  args: {
    onSearch: (value: string) => {
      console.warn("search:", value);
    },
    onSubmit: () => {
      console.warn("submit");
    },
  },
};

export const WithClear: Story = {
  args: {
    searchQuery: "valeur à effacer",
    onSearch: (value: string) => {
      console.warn("search:", value);
    },
    onClear: () => {
      console.warn("cleared");
    },
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: "Chercher un utilisateur...",
    onSearch: (value: string) => {
      console.warn("search:", value);
    },
  },
};

const SearchInputStoryWrapper = (): React.ReactElement => {
  const [query, setQuery] = useState("");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <SearchInput
          searchQuery={query}
          onSearch={setQuery}
          onClear={() => {
            setQuery("");
          }}
          onSubmit={() => {
            console.warn("submitted:", query);
          }}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setQuery("");
          }}
          disabled={query === ""}
        >
          <FilterXIcon /> Réinitialiser les filtres
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">Valeur : {query !== "" ? query : "(vide)"}</p>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <SearchInputStoryWrapper />,
};
