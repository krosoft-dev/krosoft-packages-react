import type { Meta, StoryObj } from "@storybook/react-vite";
import { PencilIcon, PlusIcon, TagIcon, TagsIcon, Trash2Icon } from "lucide-react";
import React, { useMemo, useState } from "react";
import FormDialog from "@/components/core/dialogs/FormDialog";
import { SearchInput } from "@/components/core/inputs/SearchInput";
import { AppPageHeader } from "@/components/core/layouts/AppPageHeader";
import { DataTable } from "@/components/core/table/DataTable";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef, FormSchema, RowAction } from "@/types";

// --- Modèle de données -------------------------------------------------------

interface Tag extends Record<string, unknown> {
  id: string;
  nom: string;
  documents: number;
  projets: number;
}

// Compteurs volontairement contrastés : des tags très utilisés, des tags réservés à un seul
// des deux référentiels, et des doublons évidents à fusionner (« en cours » / « en-cours »).
const TAGS_INITIAUX: Tag[] = [
  { id: "1", nom: "archivé", documents: 12, projets: 3 },
  { id: "2", nom: "à relire", documents: 4, projets: 0 },
  { id: "3", nom: "bloqué", documents: 0, projets: 2 },
  { id: "4", nom: "brouillon", documents: 7, projets: 0 },
  { id: "5", nom: "client", documents: 9, projets: 6 },
  { id: "6", nom: "confidentiel", documents: 3, projets: 1 },
  { id: "7", nom: "en cours", documents: 5, projets: 8 },
  { id: "8", nom: "en-cours", documents: 1, projets: 2 },
  { id: "9", nom: "interne", documents: 6, projets: 4 },
  { id: "10", nom: "prioritaire", documents: 2, projets: 5 },
  { id: "11", nom: "public", documents: 8, projets: 0 },
  { id: "12", nom: "récurrent", documents: 0, projets: 3 },
  { id: "13", nom: "urgent", documents: 3, projets: 7 },
  { id: "14", nom: "validé", documents: 11, projets: 2 },
];

const TAG_VIERGE: Tag = { id: "", nom: "", documents: 0, projets: 0 };

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
          placeholderKey: "urgent, interne, validé...",
          rules: z => z.string().min(1, "Le nom est requis").max(30, "30 caractères maximum"),
          layout: { cols: 4 },
        },
      ],
    },
  ],
};

// --- Page de démonstration ---------------------------------------------------

const TagsPage = (): React.JSX.Element => {
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
        return [...prev, { nom, documents: 0, projets: 0, id }];
      }

      if (!existant) return prev.map(t => (t.id === cibleId ? { ...t, nom } : t));

      const source = prev.find(t => t.id === cibleId);
      return prev
        .filter(t => t.id !== cibleId)
        .map(t => (t.id === existant.id ? { ...t, documents: t.documents + (source?.documents ?? 0), projets: t.projets + (source?.projets ?? 0) } : t));
    });
    // La modale reste ouverte après un enregistrement : la refermer évite d'afficher une fiche
    // périmée, en particulier après une fusion où le tag renommé n'existe plus.
    setOpen(false);
  };

  const columns: ColumnDef<Tag>[] = [
    {
      key: "nom",
      headerKey: "Tag",
      minWidth: 220,
      sortable: true,
      renderCell: row => (
        <Badge variant="outline" className="border-primary/40 text-primary">
          {row.nom}
        </Badge>
      ),
    },
    // `align: "right"` range les nombres ET leur en-tête du même côté.
    { key: "documents", headerKey: "Documents", minWidth: 130, sortable: true, align: "right" },
    { key: "projets", headerKey: "Projets", minWidth: 130, sortable: true, align: "right" },
  ];

  const actions: RowAction<Tag>[] = [
    { labelKey: "Renommer", icon: PencilIcon, overflow: true, onClick: ouvrirRenommage },
    {
      labelKey: "Supprimer",
      icon: Trash2Icon,
      overflow: true,
      className: "text-destructive focus:bg-destructive/10 focus:text-destructive",
      // Un tag encore rattaché à un document ou à un projet ne peut pas disparaître.
      disabled: row => row.documents > 0 || row.projets > 0,
      onClick: supprimer,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4">
      <AppPageHeader
        icon={TagsIcon}
        titleKey="Tags"
        descriptionKey="Partagés par les documents et les projets. Renommez pour fusionner les doublons, supprimez ceux qui ne servent plus."
        actions={[{ labelKey: "Nouveau tag", icon: PlusIcon, onClick: ouvrirCreation }]}
      />

      <SearchInput searchQuery={recherche} placeholder="Rechercher un tag..." onSearch={setRecherche} />

      <DataTable data={tagsFiltres} config={{ columns, getRowId: row => row.id, actions, columnVisibility: true, defaultPageSize: 10 }} />

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
  title: "Démos/Tags",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Page d'administration d'un référentiel de tags : `AppPageHeader` avec son action principale, `SearchInput` en filtre, puis un `DataTable` trié par défaut sur la première colonne triable, paginé (14 tags, 10 par page) et doté d'un menu d'actions par ligne.\n\nLes deux colonnes de comptage utilisent `align: \"right\"` : les nombres et leur en-tête se rangent du même côté.\n\nÀ essayer : renommer « en-cours » en « en cours » fusionne les deux doublons en cumulant les compteurs, et la suppression reste désactivée tant que le tag est rattaché à un document ou à un projet.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Tags: Story = {
  name: "Référentiel de tags",
  render: () => <TagsPage />,
};
