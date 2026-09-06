import { useKrosoftTranslation } from "@/i18n";
import { Button } from "@/components/ui";
import { useMobile } from "@/hooks/ui";
import { FilterXIcon } from "lucide-react";
import React from "react";
import { SearchInput } from "../inputs/SearchInput";
import { FiltersMobileDrawer } from "./FiltersMobileDrawer";

export interface FiltersContainerProps {
  children?: React.ReactNode;
  search?: string;
  searchPlaceholder?: string;
  activeFiltersCount?: number;
  onReset?: () => void;
  onSearch?: (value: string) => void;
}

export function FiltersContainer({
  children,
  search,
  searchPlaceholder,
  activeFiltersCount = 0,
  onReset,
  onSearch,
}: FiltersContainerProps): React.ReactElement {
  const { t } = useKrosoftTranslation();
  const isMobile = useMobile();

  if (isMobile) {
    return (
      <div className="flex items-center gap-2">
        {onSearch !== undefined && (
          <div className="flex-1">
            <SearchInput search={search ?? ""} onSearch={onSearch} placeholder={searchPlaceholder} />
          </div>
        )}
        <FiltersMobileDrawer activeFiltersCount={activeFiltersCount} onReset={onReset}>
          {children}
        </FiltersMobileDrawer>
      </div>
    );
  }

  return (
    <div className="flex justify-between">
      <div className="flex flex-wrap gap-2">
        {onSearch !== undefined && <SearchInput search={search ?? ""} onSearch={onSearch} placeholder={searchPlaceholder} />}
        {children}
      </div>
      {onReset && (
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" onClick={onReset} className="relative">
            <FilterXIcon />
            {t("filters.reset")}
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
