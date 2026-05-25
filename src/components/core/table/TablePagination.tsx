import React from "react";
import { Button } from "../../ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export interface TablePaginationProps {
  totalItems: number;
  startIndex: number;
  endIndex: number;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageSizeOptions: number[];
  totalPages: number;
}

export function TablePagination({
  totalItems,
  startIndex,
  endIndex,
  pageSize,
  setPageSize,
  currentPage,
  setCurrentPage,
  pageSizeOptions,
  totalPages,
}: TablePaginationProps): React.JSX.Element {
  return (
    <div className="px-4 py-2 border-t border-border flex items-center justify-between bg-card flex-wrap gap-2">
      <div className="text-sm text-muted-foreground">
        {totalItems === 0 ? "0" : `${String(startIndex + 1)} - ${String(endIndex)}`} sur {totalItems}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Lignes par page :</span>
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-input bg-background rounded px-2 py-1 text-sm text-foreground"
          >
            {pageSizeOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {
              setCurrentPage(prev => Math.max(1, prev - 1));
            }}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {
              setCurrentPage(prev => Math.min(totalPages, prev + 1));
            }}
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
