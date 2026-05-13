import type { Meta, StoryObj } from "@storybook/react";
import DataTable, { ColumnDef } from "@/components/core/table/DataTable";
import React from "react";
import { Badge } from "@/components/ui/badge";

const meta: Meta<typeof DataTable> = {
  title: "Core/Table/DataTable",
  component: DataTable,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type UserData = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
  status: "active" | "inactive";
  lastLogin: string;
};

const mockData: UserData[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    status: "active",
    lastLogin: "2023-10-25T10:30:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user",
    status: "active",
    lastLogin: "2023-10-24T14:15:00Z",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "guest",
    status: "inactive",
    lastLogin: "2023-09-15T08:45:00Z",
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice.williams@example.com",
    role: "user",
    status: "active",
    lastLogin: "2023-10-26T09:20:00Z",
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    role: "user",
    status: "inactive",
    lastLogin: "2023-10-10T11:10:00Z",
  },
];

const columns: ColumnDef<UserData>[] = [
  {
    key: "name",
    label: "Name",
    minWidth: 150,
  },
  {
    key: "email",
    label: "Email",
    minWidth: 200,
  },
  {
    key: "role",
    label: "Role",
    minWidth: 100,
    renderCell: row => <span className="capitalize">{row.role}</span>,
  },
  {
    key: "status",
    label: "Status",
    minWidth: 100,
    renderCell: row => <Badge variant={row.status === "active" ? "default" : "secondary"}>{row.status === "active" ? "Active" : "Inactive"}</Badge>,
  },
  {
    key: "lastLogin",
    label: "Last Login",
    minWidth: 150,
    renderCell: row => new Date(row.lastLogin).toLocaleDateString(),
  },
];

type Story = StoryObj<typeof DataTable>;

export const Default: Story = {
  args: {
    data: mockData,
    columns,
    getRowId: (row: UserData) => row.id,
  },
};

export const WithRowClick: Story = {
  args: {
    data: mockData,
    columns,
    getRowId: (row: UserData) => row.id,
    onRowClick: (row: UserData) => {
      console.warn(`Clicked on row: ${row.name}`);
    },
  },
};

export const WithActions: Story = {
  args: {
    data: mockData,
    columns,
    getRowId: (row: UserData) => row.id,
    onEditRow: (row: UserData) => {
      console.warn(`Edit row: ${row.name}`);
    },
    onDeleteRow: (row: UserData) => {
      console.warn(`Delete row: ${row.name}`);
    },
  },
};

export const WithBulkActions: Story = {
  args: {
    data: mockData,
    columns,
    getRowId: (row: UserData) => row.id,
    bulkActions: [
      {
        label: "Activate Selected",
        onClick: (selectedIds: string[], clearSelection: () => void): void => {
          console.warn(`Activating users with IDs: ${selectedIds.join(", ")}`);
          clearSelection();
        },
      },
      {
        label: "Delete Selected",
        variant: "destructive",
        onClick: (selectedIds: string[], clearSelection: () => void): void => {
          console.warn(`Deleting users with IDs: ${selectedIds.join(", ")}`);
          clearSelection();
        },
      },
    ],
  },
};

export const FullFeatured: Story = {
  args: {
    data: mockData,
    columns,
    getRowId: (row: UserData) => row.id,
    onRowClick: (row: UserData) => {
      console.warn(`Clicked on row: ${row.name}`);
    },
    onEditRow: (row: UserData) => {
      console.warn(`Edit row: ${row.name}`);
    },
    onDeleteRow: (row: UserData) => {
      console.warn(`Delete row: ${row.name}`);
    },
    bulkActions: [
      {
        label: "Export Selected",
        onClick: (selectedIds: string[], clearSelection: () => void): void => {
          console.warn(`Exporting users with IDs: ${selectedIds.join(", ")}`);
          clearSelection();
        },
      },
      {
        label: "Delete Selected",
        variant: "destructive",
        onClick: (selectedIds: string[], clearSelection: () => void): void => {
          console.warn(`Deleting users with IDs: ${selectedIds.join(", ")}`);
          clearSelection();
        },
      },
    ],
  },
};
