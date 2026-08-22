import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ImageInput } from "@/components/core/inputs/ImageInput";

const meta: Meta<typeof ImageInput> = {
  title: "Core/Inputs/ImageInput",
  component: ImageInput,
  args: {
    accept: "image/jpeg,image/png,image/webp",
    maxSizeMB: 2,
    disabled: false,
    hint: "JPG, PNG, WEBP",
  },
  argTypes: {
    accept: { control: "text" },
    maxSizeMB: { control: "number" },
    disabled: { control: "boolean" },
    hint: { control: "text" },
    className: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof ImageInput>;

export const Default: Story = {
  args: {
    onChange: (file: File | null) => {
      console.log("onChange:", file);
    },
  },
};

export const WithPreview: Story = {
  args: {
    value: "https://placehold.co/200x200/6366f1/ffffff?text=Preview",
    onChange: (file: File | null) => {
      console.log("onChange:", file);
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    onChange: (file: File | null) => {
      console.log("onChange:", file);
    },
  },
};

export const DisabledWithImage: Story = {
  args: {
    disabled: true,
    value: "https://placehold.co/200x200/6366f1/ffffff?text=Locked",
    onChange: (file: File | null) => {
      console.log("onChange:", file);
    },
  },
};

export const CustomAccept: Story = {
  args: {
    accept: "image/png",
    hint: "PNG uniquement",
    onChange: (file: File | null) => {
      console.log("onChange:", file);
    },
  },
};

export const SmallMaxSize: Story = {
  args: {
    maxSizeMB: 0.5,
    onChange: (file: File | null) => {
      console.log("onChange:", file);
    },
  },
};

export const Interactive: Story = {
  render: () => {
    const [preview, setPreview] = useState<string | undefined>(undefined);

    const handleChange = (file: File | null) => {
      if (file) {
        const url = URL.createObjectURL(file);
        setPreview(url);
      } else {
        setPreview(undefined);
      }
    };

    return (
      <div className="flex flex-col gap-4">
        <ImageInput value={preview} onChange={handleChange} />
        <p className="text-sm text-muted-foreground">{preview ? "Image sélectionnée — cliquer sur ✕ pour supprimer" : "Aucune image sélectionnée"}</p>
      </div>
    );
  },
};
