import React from "react";
import { Button } from "../../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { RowAction } from "@/types/RowAction";

export interface TableActionsProps<T> {
  actions: RowAction<T>[];
  row: T;
}

export function TableActions<T>({ actions, row }: TableActionsProps<T>): React.JSX.Element {
  return (
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
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <DropdownMenuItem
              key={i}
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
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
