import { useKrosoftTranslation } from "@/i18n";
import React from "react";
import { Button } from "../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
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

const DOTS = "…";

type PaginationRangeItem = number | typeof DOTS;

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function getPaginationRange(currentPage: number, totalPages: number, siblingCount = 1): PaginationRangeItem[] {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPageNumbers >= totalPages) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftRange = range(1, siblingCount + 2);
    return [...leftRange, DOTS, totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightRange = range(totalPages - (siblingCount + 2) + 1, totalPages);
    return [1, DOTS, ...rightRange];
  }

  return [1, DOTS, ...range(leftSiblingIndex, rightSiblingIndex), DOTS, totalPages];
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
  const { t } = useKrosoftTranslation();
  const paginationRange = getPaginationRange(currentPage, totalPages);

  return (
    <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:grid sm:grid-cols-3 items-center gap-2 bg-muted/50 dark:bg-gray-900/50">
      <div className="text-sm text-muted-foreground justify-self-start">
        {totalItems === 0 ? "0" : `${String(startIndex + 1)} - ${String(endIndex)}`} sur {totalItems}
      </div>

      <div className="flex items-center justify-center gap-1">
        {totalPages > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-control"
              onClick={() => {
                setCurrentPage(prev => Math.max(1, prev - 1));
              }}
              disabled={currentPage === 1}
              aria-label={t("table.previousPage")}
            >
              <ChevronLeftIcon className="size-4" />
            </Button>

            {paginationRange.map((page, index) =>
              page === DOTS ? (
                <span key={`dots-${String(index)}`} className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground">
                  {DOTS}
                </span>
              ) : (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8 rounded-control text-sm"
                  onClick={() => {
                    setCurrentPage(page);
                  }}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </Button>
              ),
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-control"
              onClick={() => {
                setCurrentPage(prev => Math.min(totalPages, prev + 1));
              }}
              disabled={currentPage === totalPages}
              aria-label={t("table.nextPage")}
            >
              <ChevronRightIcon className="size-4" />
            </Button>
          </>
        )}
      </div>

      <div className="justify-self-end">
        <Select
          value={String(pageSize)}
          onValueChange={value => {
            setPageSize(Number(value));
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="h-8 w-[110px] text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map(option => (
              <SelectItem key={option} value={String(option)}>
                {option} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
