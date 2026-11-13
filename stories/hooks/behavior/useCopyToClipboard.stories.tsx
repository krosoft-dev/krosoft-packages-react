import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useCopyToClipboard } from "@/hooks/behavior/useCopyToClipboard";

const COPIED_FEEDBACK_MS = 2000;
const API_KEY = "kro_demo_3f2b6c1e8a4d4f0e9b7a1c2d3e4f5a6b";

interface CopyDemoProps {
  silentSuccess?: boolean;
}

/**
 * Démo du hook useCopyToClipboard. Par défaut, la copie affiche un toast ;
 * avec `silentSuccess`, le bouton affiche lui-même « Copiée » et seul l'échec est notifié.
 */
const CopyDemo = ({ silentSuccess = false }: CopyDemoProps): React.ReactElement => {
  const { copy } = useCopyToClipboard({ silentSuccess });
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<number | undefined>(undefined);

  React.useEffect(
    () => () => {
      window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  const handleCopy = async (): Promise<void> => {
    if (!(await copy(API_KEY)) || !silentSuccess) {
      return;
    }
    setCopied(true);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setCopied(false);
    }, COPIED_FEEDBACK_MS);
  };

  return (
    <div className="flex flex-col items-start gap-3 p-8">
      <code className="rounded-md border bg-muted/50 px-3 py-2 font-mono text-xs">{API_KEY}</code>
      <Button type="button" variant="outline" onClick={() => void handleCopy()}>
        {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
        {copied ? "Copiée" : "Copier"}
      </Button>
      <Toaster />
    </div>
  );
};

const meta: Meta<typeof CopyDemo> = {
  title: "Hooks/useCopyToClipboard",
  component: CopyDemo,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof CopyDemo>;

/** Toast de succès après la copie. */
export const Default: Story = {};

/** Pas de toast de succès : le bouton affiche « Copiée » pendant 2 s. */
export const SilentSuccess: Story = {
  args: {
    silentSuccess: true,
  },
};
