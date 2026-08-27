import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TableBulkActions } from "@/components/core/table/TableBulkActions";
import type { DataTableBulkAction } from "@/types/DataTableBulkAction";
import { Download, Mail, Trash2 } from "lucide-react";

const ACTIONS_DEFAULT: DataTableBulkAction[] = [
  {
    labelKey: "Exporter",
    icon: Download,
    onClick: (_ids, clear) => {
      clear();
    },
  },
  {
    labelKey: "Envoyer un email",
    icon: Mail,
    onClick: (_ids, clear) => {
      clear();
    },
  },
];

const ACTIONS_WITH_DESTRUCTIVE: DataTableBulkAction[] = [
  ...ACTIONS_DEFAULT,
  {
    labelKey: "Supprimer",
    icon: Trash2,
    variant: "destructive",
    onClick: (_ids, clear) => {
      clear();
    },
  },
];

const meta: Meta<typeof TableBulkActions> = {
  title: "Core/Table/TableBulkActions",
  component: TableBulkActions,
  decorators: [
    Story => (
      <div className="w-full p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TableBulkActions>;

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState(["1", "2", "3"]);
    return <TableBulkActions selectedRows={selected} setSelectedRows={setSelected} bulkActions={ACTIONS_DEFAULT} />;
  },
};

export const WithDestructiveAction: Story = {
  render: () => {
    const [selected, setSelected] = useState(["1", "2", "3"]);
    return <TableBulkActions selectedRows={selected} setSelectedRows={setSelected} bulkActions={ACTIONS_WITH_DESTRUCTIVE} />;
  },
};

export const SingleSelection: Story = {
  render: () => {
    const [selected, setSelected] = useState(["1"]);
    return <TableBulkActions selectedRows={selected} setSelectedRows={setSelected} bulkActions={ACTIONS_WITH_DESTRUCTIVE} />;
  },
};

export const ManySelected: Story = {
  render: () => {
    const [selected, setSelected] = useState(Array.from({ length: 42 }, (_, i) => String(i + 1)));
    return <TableBulkActions selectedRows={selected} setSelectedRows={setSelected} bulkActions={ACTIONS_WITH_DESTRUCTIVE} />;
  },
};

export const NoIcon: Story = {
  render: () => {
    const [selected, setSelected] = useState(["1", "2"]);
    const actions: DataTableBulkAction[] = [
      {
        labelKey: "Archiver",
        onClick: (_ids, clear) => {
          clear();
        },
      },
      {
        labelKey: "Dupliquer",
        onClick: (_ids, clear) => {
          clear();
        },
      },
    ];
    return <TableBulkActions selectedRows={selected} setSelectedRows={setSelected} bulkActions={actions} />;
  },
};

export const Interactive: Story = {
  render: () => {
    const [selected, setSelected] = useState(["id-1", "id-2", "id-5", "id-8"]);
    const [log, setLog] = useState<string[]>([]);

    const actions: DataTableBulkAction[] = [
      {
        labelKey: "Exporter",
        icon: Download,
        onClick: (ids, clear) => {
          setLog(prev => [`Export : ${ids.join(", ")}`, ...prev]);
          clear();
        },
      },
      {
        labelKey: "Envoyer un email",
        icon: Mail,
        onClick: (ids, clear) => {
          setLog(prev => [`Email : ${ids.join(", ")}`, ...prev]);
          clear();
        },
      },
      {
        labelKey: "Supprimer",
        icon: Trash2,
        variant: "destructive",
        onClick: (ids, clear) => {
          setLog(prev => [`Suppression : ${ids.join(", ")}`, ...prev]);
          clear();
        },
      },
    ];

    return (
      <div className="space-y-4">
        <TableBulkActions selectedRows={selected} setSelectedRows={setSelected} bulkActions={actions} />
        {log.length > 0 && (
          <ul className="text-xs text-muted-foreground space-y-1">
            {log.map((entry, i) => (
              <li key={i}>→ {entry}</li>
            ))}
          </ul>
        )}
      </div>
    );
  },
};
