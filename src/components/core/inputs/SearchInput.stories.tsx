import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SearchInput } from "./SearchInput";

const meta: Meta<typeof SearchInput> = {
  title: "Core/Inputs/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj<typeof SearchInput> = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState("");

    return (
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-medium">Composant de recherche générique</h3>
        <SearchInput
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onClear={() => setSearchQuery("")}
          onSubmit={() => alert(`Recherche soumise : ${searchQuery}`)}
          placeholder="Rechercher des éléments..."
        />
        
        <div className="mt-4 text-sm text-gray-600">
          Valeur actuelle de la recherche : <strong>{searchQuery || "(vide)"}</strong>
        </div>
      </div>
    );
  },
};
