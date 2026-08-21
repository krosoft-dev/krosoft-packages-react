import type { Meta, StoryObj } from "@storybook/react-vite";
import { PencilIcon, PlusIcon, TagIcon, TagsIcon, Trash2Icon } from "lucide-react";
import React, { useMemo, useState } from "react";
import FormDialog from "@/components/core/dialogs/FormDialog";
import { SearchInput } from "@/components/core/inputs/SearchInput";
import { AppPageHeader } from "@/components/core/layouts/AppPageHeader";
import { ColumnDef, DataTable, RowAction } from "@/components/core/table/DataTable";
import { Badge } from "@/components/ui/badge";
import type { FormSchema } from "@/types";

// --- Modèle de données -------------------------------------------------------

interface Tag extends Record<string, unknown> {
  id: string;
  nom: string;
  recettes: number;
  repas: number;
}

// Les compteurs sont volontairement contrastés : des tags très utilisés (plat, végétarien),
// des tags réservés aux repas prédéfinis (livraison, à emporter) et des doublons à fusionner.
const TAGS_INITIAUX: Tag[] = [
  { id: "1", nom: "à emporter", recettes: 0, repas: 1 },
  { id: "2", nom: "asiatique", recettes: 2, repas: 1 },
  { id: "3", nom: "de saison", recettes: 2, repas: 0 },
  { id: "4", nom: "dessert", recettes: 2, repas: 0 },
  { id: "5", nom: "entrée", recettes: 2, repas: 0 },
  { id: "6", nom: "italien", recettes: 2, repas: 1 },
  { id: "7", nom: "livraison", recettes: 0, repas: 1 },
  { id: "8", nom: "plat", recettes: 6, repas: 0 },
  { id: "9", nom: "rapide", recettes: 4, repas: 2 },
  { id: "10", nom: "réconfortant", recettes: 3, repas: 0 },
  { id: "11", nom: "salade", recettes: 1, repas: 0 },
  { id: "12", nom: "sans gluten", recettes: 2, repas: 0 },
  { id: "13", nom: "soupe", recettes: 2, repas: 1 },
  { id: "14", nom: "végétarien", recettes: 5, repas: 1 },
];

const TAG_VIERGE: Tag = { id: "", nom: "", recettes: 0, repas: 0 };

const schema: FormSchema<Tag> = {
  useCards: false,
  sections: [
    {
      titleKey: "Tag",
      icon: TagIcon,
      iconClassName: "text-indigo-500",
      fields: [
        {
          key: "nom",
          labelKey: "Nom du tag",
          type: "text",
          placeholderKey: "végétarien, rapide, dessert...",
          rules: z => z.string().min(1, "Le nom est requis").max(30, "30 caractères maximum"),
          layout: { cols: 4 },
        },
      ],
    },
  ],
};

// --- Page de démonstration ---------------------------------------------------

const TagsCuisinePage = (): React.JSX.Element => {
  const [tags, setTags] = useState<Tag[]>(TAGS_INITIAUX);
  const [recherche, setRecherche] = useState("");
  const [selection, setSelection] = useState<Tag | null>(null);
  const [open, setOpen] = useState(false);
  const [creation, setCreation] = useState(false);

  const tagsFiltres = useMemo(() => {
    const terme = recherche.trim().toLowerCase();
    if (terme === "") return tags;
    return tags.filter(tag => tag.nom.toLowerCase().includes(terme));
  }, [tags, recherche]);

  const ouvrirCreation = (): void => {
    setCreation(true);
    setSelection({ ...TAG_VIERGE });
    setOpen(true);
  };

  const ouvrirRenommage = (tag: Tag): void => {
    setCreation(false);
    setSelection(tag);
    setOpen(true);
  };

  const supprimer = (tag: Tag): void => {
    setTags(prev => prev.filter(t => t.id !== tag.id));
  };

  // Renommer un tag vers un nom déjà pris le fusionne avec l'existant : c'est la promesse
  // affichée dans la description de la page, et le seul moyen de rattraper un doublon.
  //
  // L'identifiant est repris de la ligne ouverte dans la modale, pas des valeurs du formulaire :
  // le resolver Zod ne renvoie que les champs déclarés dans le schéma, et `id` n'en fait pas partie.
  const enregistrer = async (data: Tag): Promise<void> => {
    const cibleId = selection?.id ?? "";
    await new Promise(resolve => setTimeout(resolve, 500));
    setTags(prev => {
      const nom = data.nom.trim();
      const existant = prev.find(t => t.id !== cibleId && t.nom.toLowerCase() === nom.toLowerCase());

      if (creation) {
        if (existant) return prev;
        const id = (Math.max(0, ...prev.map(t => Number(t.id))) + 1).toString();
        return [...prev, { nom, recettes: 0, repas: 0, id }];
      }

      if (!existant) return prev.map(t => (t.id === cibleId ? { ...t, nom } : t));

      const source = prev.find(t => t.id === cibleId);
      return prev
        .filter(t => t.id !== cibleId)
        .map(t => (t.id === existant.id ? { ...t, recettes: t.recettes + (source?.recettes ?? 0), repas: t.repas + (source?.repas ?? 0) } : t));
    });
    // La modale reste ouverte après un enregistrement : la refermer évite d'afficher une fiche
    // périmée, en particulier après une fusion où le tag renommé n'existe plus.
    setOpen(false);
  };

  const columns: ColumnDef<Tag>[] = [
    {
      key: "nom",
      label: "Tag",
      minWidth: 220,
      sortable: true,
      renderCell: row => (
        <Badge variant="outline" className="border-primary/40 text-primary">
          {row.nom}
        </Badge>
      ),
    },
    { key: "recettes", label: "Recettes", minWidth: 120, sortable: true, className: "text-right" },
    { key: "repas", label: "Repas", minWidth: 120, sortable: true, className: "text-right" },
  ];

  const actions: RowAction<Tag>[] = [
    { label: "Renommer", icon: PencilIcon, overflow: true, onClick: ouvrirRenommage },
    {
      label: "Supprimer",
      icon: Trash2Icon,
      overflow: true,
      className: "text-destructive focus:bg-destructive/10 focus:text-destructive",
      // Un tag encore rattaché à une recette ou à un repas ne peut pas disparaître.
      disabled: row => row.recettes > 0 || row.repas > 0,
      onClick: supprimer,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4">
      <AppPageHeader
        icon={TagsIcon}
        titleKey="Tags Cuisine"
        descriptionKey="Partagés par les recettes et les repas prédéfinis. Renommez pour fusionner les doublons, supprimez ceux qui ne servent plus."
        actions={[{ labelKey: "Nouveau tag", icon: PlusIcon, onClick: ouvrirCreation }]}
      />

      <SearchInput searchQuery={recherche} placeholder="Rechercher un tag..." onSearch={setRecherche} />

      <DataTable data={tagsFiltres} columns={columns} getRowId={row => row.id} actions={actions} defaultPageSize={10} columnVisibility />

      <FormDialog<Tag>
        open={open}
        onOpenChange={setOpen}
        data={selection}
        title={data => (creation ? "Nouveau tag" : `Renommer : ${data.nom}`)}
        schema={schema}
        onSave={enregistrer}
        defaultEditing
        saveLabel={creation ? "Créer le tag" : "Renommer"}
      />
    </div>
  );
};

const meta: Meta = {
  title: "Démos/Tags Cuisine",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Page d'administration d'un référentiel de tags : `AppPageHeader` avec son action principale, `SearchInput` en filtre, puis un `DataTable` trié par défaut sur la première colonne triable, paginé (14 tags, 10 par page) et doté d'un menu d'actions par ligne.\n\nÀ essayer : renommer un tag vers un nom déjà pris le fusionne avec l'existant en cumulant les compteurs, et la suppression est désactivée tant que le tag est rattaché à une recette ou à un repas.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const TagsCuisine: Story = {
  name: "Référentiel de tags",
  render: () => <TagsCuisinePage />,
};
