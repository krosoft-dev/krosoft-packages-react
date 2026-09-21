import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileIcon, ImageIcon, WorkflowIcon } from "lucide-react";
import { useState } from "react";
import { FileDropzone } from "@/components/core/inputs/FileDropzone";

const meta: Meta<typeof FileDropzone> = {
  title: "Core/Inputs/FileDropzone",
  component: FileDropzone,
  args: {
    multiple: true,
    uploading: false,
  },
  argTypes: {
    accept: { control: "text" },
    multiple: { control: "boolean" },
    title: { control: "text" },
    hint: { control: "text" },
    formats: { control: "text" },
    uploading: { control: "boolean" },
    uploadingLabel: { control: "text" },
    className: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof FileDropzone>;

const logFiles = (files: File[]) => {
  console.log(
    "onFiles:",
    files.map(f => f.name),
  );
};

export const Default: Story = {
  args: {
    onFiles: logFiles,
  },
};

export const WithFormats: Story = {
  args: {
    accept: ".pdf,image/*,.docx,.txt",
    formats: "PDF, images, Office, texte · max 20 Mo par fichier",
    onFiles: logFiles,
  },
};

export const SingleFile: Story = {
  args: {
    multiple: false,
    accept: "application/json,.json",
    formats: "Fichier .json uniquement",
    onFiles: logFiles,
  },
};

export const CustomIcon: Story = {
  args: {
    accept: ".yaml",
    icon: WorkflowIcon,
    formats: "Fichiers YAML uniquement",
    onFiles: logFiles,
  },
};

export const CustomLabels: Story = {
  args: {
    icon: ImageIcon,
    title: "Déposez vos visuels",
    hint: "ou parcourez votre disque",
    formats: "JPG, PNG, WEBP",
    accept: "image/*",
    onFiles: logFiles,
  },
};

export const Uploading: Story = {
  args: {
    uploading: true,
    uploadingLabel: "Envoi en cours…",
    onFiles: logFiles,
  },
};

export const Interactive: Story = {
  render: () => {
    const [files, setFiles] = useState<File[]>([]);

    return (
      <div className="flex flex-col gap-4">
        <FileDropzone
          icon={FileIcon}
          formats="Tous types de fichiers"
          onFiles={incoming => {
            setFiles(prev => [...prev, ...incoming]);
          }}
        />
        {files.length > 0 ? (
          <ul className="space-y-1 text-sm text-muted-foreground">
            {files.map((file, index) => (
              <li key={`${file.name}-${String(index)}`}>• {file.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Aucun fichier sélectionné</p>
        )}
      </div>
    );
  },
};
