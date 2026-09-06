import { useKrosoftTranslation } from "@/i18n";
import { Button, Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui";
import { FilterIcon, FilterXIcon } from "lucide-react";
import React, { useState } from "react";

export interface FiltersMobileDrawerProps {
  children: React.ReactNode;
  activeFiltersCount?: number;
  onReset?: () => void;
  onApply?: () => void;
}

export function FiltersMobileDrawer({ children, activeFiltersCount = 0, onReset, onApply }: FiltersMobileDrawerProps): React.ReactElement {
  const { t } = useKrosoftTranslation();
  const [open, setOpen] = useState(false);

  const handleApply = (): void => {
    onApply?.();
    setOpen(false);
  };

  const handleReset = (): void => {
    onReset?.();
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="relative">
          <FilterIcon className="h-4 w-4 mr-2" />
          {t("filters.filter")}
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("filters.title")}</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-4 px-4 pb-4">{children}</div>
        <DrawerFooter className="flex-row gap-2">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            <FilterXIcon className="h-4 w-4 mr-2" />
            {t("filters.reset")}
          </Button>
          <DrawerClose asChild>
            <Button onClick={handleApply} className="flex-1">
              {t("actions.apply")}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
