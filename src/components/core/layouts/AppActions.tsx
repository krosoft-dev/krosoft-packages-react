import { Button } from "@/components/ui";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/helpers/tailwind.helper";
import { useMobile } from "../../../hooks/ui/useMobile";
import { MoreVerticalIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppAction } from "@/types/AppAction";

export interface AppActionsProps {
  actions?: AppAction[];
  className?: string;
}

export function AppActions({ actions, className }: AppActionsProps): React.JSX.Element | null {
  const { t } = useTranslation();
  const isMobile = useMobile();

  if (!actions || actions.length === 0) return null;

  // Mobile: affiche toutes les actions dans un seul dropdown
  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-48">
          {actions.map((action, index) => {
            if (!action) return null;

            // Si l'action a des enfants, les afficher aussi
            if (action.children && action.children.length > 0) {
              return (
                <div key={index}>
                  {index > 0 && <DropdownMenuSeparator />}
                  {action.children.map((child, childIndex) => {
                    if (!child) return null;
                    return (
                      <DropdownMenuItem
                        key={childIndex}
                        onClick={() => void child.onClick()}
                        disabled={child.disabled}
                        className={cn("gap-2", child.className)}
                      >
                        {child.icon && <child.icon className="size-4" />}
                        {child.labelKey && t(child.labelKey)}
                      </DropdownMenuItem>
                    );
                  })}
                </div>
              );
            }

            return (
              <DropdownMenuItem key={index} onClick={() => void action.onClick()} disabled={action.disabled} className={cn("gap-2", action.className)}>
                {action.icon && <action.icon className="size-4" />}
                {action.labelKey && t(action.labelKey)}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Desktop: comportement actuel
  const renderActions = (actions: AppAction[]): React.JSX.Element => {
    return (
      <div className={cn("flex gap-2", className)}>
        {actions.map((action, index) => {
          if (!action) return null;

          if (action.children && action.children.length > 0) {
            return (
              <DropdownMenu key={index}>
                <DropdownMenuTrigger asChild>
                  <Button variant={action.variant} disabled={action.disabled} className={cn("gap-2", action.className)}>
                    {action.icon && <action.icon className="size-4" />}
                    {action.labelKey && t(action.labelKey)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {action.children.map((child, childIndex) => {
                    if (!child) return null;

                    return (
                      <DropdownMenuItem
                        key={childIndex}
                        onClick={() => void child.onClick()}
                        disabled={child.disabled}
                        className={cn("gap-2", child.className)}
                      >
                        {child.icon && <child.icon className="size-4" />}
                        {child.labelKey && t(child.labelKey)}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }

          return (
            <Button
              key={index}
              variant={action.variant}
              onClick={() => void action.onClick()}
              disabled={action.disabled}
              className={cn("gap-2", action.className)}
            >
              {action.icon && <action.icon className="size-4" />}
              {action.labelKey && t(action.labelKey)}
            </Button>
          );
        })}
      </div>
    );
  };

  return renderActions(actions);
}
