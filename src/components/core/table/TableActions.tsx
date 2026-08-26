import React from "react";
import { Button } from "../../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { useKrosoftTranslation } from "@/i18n";
import { RowAction } from "@/types/RowAction";

export interface TableActionsProps<T> {
  actions: RowAction<T>[];
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
    <div className="flex items-center justify-end gap-1">
      {primaryActions.map((action, i) => {
        const Icon = action.icon;
        return (
          <Button
            key={i}
            variant={action.variant ?? "ghost"}
            size="sm"
            disabled={action.disabled?.(row) ?? false}
            className={`h-7 px-2 text-muted-foreground hover:text-foreground ${action.className ?? ""}`}
            onClick={e => {
              e.stopPropagation();
              action.onClick(row);
            }}
          >
            {Icon !== undefined && <Icon className="size-3.5" />}
            {t(action.labelKey)}
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
  );
}
