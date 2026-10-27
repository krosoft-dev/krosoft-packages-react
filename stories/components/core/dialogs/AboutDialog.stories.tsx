import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AboutDialog, type AboutDialogProps } from "@/components/core/dialogs/AboutDialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const meta: Meta<typeof AboutDialog> = {
  title: "Core/Dialogs/AboutDialog",
  component: AboutDialog,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof AboutDialog>;

const DialogWrapper = (args: AboutDialogProps): React.ReactElement => {
  const [open, setOpen] = useState(false);
  const { open: _open, onOpenChange: _onOpenChange, ...restArgs } = args;

  return (
    <div>
      <Button
        onClick={(): void => {
          setOpen(true);
        }}
      >
        À propos
      </Button>
      <AboutDialog {...restArgs} open={open} onOpenChange={setOpen} />
    </div>
  );
};

export const Default: Story = {
  render: DialogWrapper,
  args: {
    info: { version: "1.4.2", environment: "Staging", buildDate: "2026-10-27T17:50:38Z" },
  },
};

export const WithLogo: Story = {
  render: DialogWrapper,
  args: {
    info: { version: "1.4.2", environment: "Production", buildDate: "2026-10-27T17:50:38Z" },
    logo: <Sparkles className="size-12 text-primary" />,
  },
};

export const VersionOnly: Story = {
  render: DialogWrapper,
  args: {
    info: { version: "1.4.2" },
  },
};
