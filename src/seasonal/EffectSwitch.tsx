import type { LucideIcon } from "lucide-react";
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface EffectSwitchProps {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

/** Ligne libellé + description + interrupteur d'un effet saisonnier. */
export const EffectSwitch = ({ id, label, description, icon: Icon, checked, onCheckedChange }: EffectSwitchProps): React.JSX.Element => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4" />
        <span>{description}</span>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  </div>
);
