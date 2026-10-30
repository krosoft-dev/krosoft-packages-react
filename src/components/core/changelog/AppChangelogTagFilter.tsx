import type { JSX } from "react";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/helpers/tailwind.helper";
import { useKrosoftTranslation } from "@/i18n";

interface AppChangelogTagFilterProps {
  tags: string[];
  selected: string[];
  onToggle: (tag: string) => void;
  onClear: () => void;
  className?: string;
}

/** Filtre par catégorie : un tag par catégorie du journal, activé ou désactivé d'un clic. */
export const AppChangelogTagFilter = ({ tags, selected, onToggle, onClear, className }: AppChangelogTagFilterProps): JSX.Element => {
  const { t } = useKrosoftTranslation();

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("changelog.tagsPlaceholder")}</p>
        {selected.length > 0 ? (
          <button type="button" onClick={onClear} className="text-xs text-muted-foreground hover:text-foreground">
            {t("actions.clear")}
          </button>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tags.map(tag => {
          const isSelected = selected.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                onToggle(tag);
              }}
              className={cn(
                badgeVariants({ variant: isSelected ? "default" : "outline" }),
                "cursor-pointer font-medium focus:ring-0 focus-visible:ring-2",
                !isSelected && "hover:bg-muted",
              )}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
};
