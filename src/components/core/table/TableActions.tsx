import React from "react";
import { Button } from "../../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { useKrosoftTranslation } from "@/i18n";
import { DataTableRowAction } from "@/types/DataTableRowAction";

export interface TableActionsProps<T> {
  actions: DataTableRowAction<T>[];
  row: T;
}

export function TableActions<T>({ actions, row }: TableActionsProps<T>): React.JSX.Element | null {
  const { t } = useKrosoftTranslation();
  const visibleActions = actions.filter(action => action.visible === undefined || action.visible(row));

  if (visibleActions.length === 0) {
    return null;
  }

  const primaryActions = visibleActions.filter(action => action.overflow !== true);
  const overflowActions = visibleActions.filter(action => action.overflow === true);

  return (
    // Provider local, comme ThemeSelector/LanguageSelector : l'infobulle marche sans provider dans l'application.
    <TooltipProvider>
      <div className="flex items-center justify-end gap-1">
        {primaryActions.map((action, i) => {
          const Icon = action.icon;
          const label = t(action.labelKey);
          const disabled = action.disabled?.(row) ?? false;
          // Sans icône, un bouton « icône seule » serait vide : on garde alors le libellé.
          const iconOnly = action.iconOnly === true && Icon !== undefined;

          if (iconOnly) {
            return (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  {/* Un bouton désactivé ne reçoit pas le survol (pointer-events: none) : le span porte l'infobulle à sa place. */}
                  <span className="inline-flex" tabIndex={disabled ? 0 : undefined}>
                    <Button
                      variant={action.variant ?? "ghost"}
                      size="icon"
                      disabled={disabled}
                      aria-label={label}
                      className={`h-7 w-7 text-muted-foreground hover:text-foreground ${action.className ?? ""}`}
                      onClick={e => {
                        e.stopPropagation();
                        action.onClick(row);
                      }}
                    >
                      <Icon className="size-3.5" />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            );
          }

          return (
            <Button
              key={i}
              variant={action.variant ?? "ghost"}
              size="sm"
              disabled={disabled}
              className={`h-7 px-2 text-muted-foreground hover:text-foreground ${action.className ?? ""}`}
              onClick={e => {
                e.stopPropagation();
                action.onClick(row);
              }}
            >
              {Icon !== undefined && <Icon className="size-3.5" />}
              {label}
            </Button>
          );
        })}
        {overflowActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                <MoreVerticalIcon className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
              }}
            >
              {overflowActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <DropdownMenuItem
                    key={i}
                    disabled={action.disabled?.(row) ?? false}
                    onClick={() => {
                      action.onClick(row);
                    }}
                    className={action.className}
                  >
                    {Icon !== undefined && (
                      <span className="mr-2 size-4 flex items-center justify-center">
                        <Icon className="size-4" />
                      </span>
                    )}
                    {t(action.labelKey)}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </TooltipProvider>
  );
}
