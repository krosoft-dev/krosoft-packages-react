import React from "react";
import { Button } from "../../ui/button";
import { BulkAction } from "@/types/BulkAction";

export interface TableBulkActionsProps {
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  bulkActions: BulkAction[];
}

export function TableBulkActions({ selectedRows, setSelectedRows, bulkActions }: TableBulkActionsProps): React.JSX.Element {
  return (
    <div className="bg-muted/60 dark:bg-gray-900/60 border border-border px-3 py-1.5 flex items-center justify-between rounded-lg">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-primary ml-1">{selectedRows.length} sélectionné(s)</span>
        <div className="flex items-center gap-2">
          {bulkActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => {
                  action.onClick(selectedRows, () => {
                    setSelectedRows([]);
                  });
                }}
                className={`h-7 bg-background shadow-sm text-xs px-2.5 ${action.variant === "destructive" ? "text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive" : "text-foreground"}`}
              >
                {Icon !== undefined && (
                  <span className="mr-1.5 flex items-center justify-center">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                )}
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setSelectedRows([]);
        }}
        className="text-xs text-muted-foreground hover:text-foreground h-7 px-2"
      >
        Désélectionner
      </Button>
    </div>
  );
}
