import { useKrosoftTranslation } from "@/i18n";
import * as React from "react";
import { ClockIcon, LoaderCircleIcon, SearchIcon, XIcon } from "lucide-react";
import { cn } from "@/helpers/tailwind.helper";
import { Button } from "../../ui/button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../ui/command";

export interface GlobalSearchItem {
  /** Identifiant stable de l'entrée : sert de clé React et de `value` cmdk. */
  key: string;
  label: string;
  /** Seconde ligne, en plus discret : module parent, référence, date… */
  description?: string;
  icon?: React.ElementType;
  /**
   * Classes de la pastille d'icône : fond et couleur du glyphe, qui hérite de
   * `currentColor` — par exemple `"bg-blue-500/10 text-blue-500"`. Sans valeur,
   * la pastille est neutre.
   */
  iconClassName?: string;
  /** Chemin de destination, laissé à la charge de l'appelant dans `onSelect`. */
  path?: string;
}

export interface GlobalSearchGroup {
  heading: string;
  items: GlobalSearchItem[];
}

export interface GlobalSearchProps {
  /** Résultats déjà filtrés et ordonnés par l'appelant, groupés par section. */
  groups: GlobalSearchGroup[];
  search: string;
  onSearch: (value: string) => void;
  onSelect: (item: GlobalSearchItem) => void;

  loading?: boolean;

  /** Mode contrôlé : sans ces props, la palette gère son ouverture elle-même. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  /** Bouton loupe intégré. `false` quand l'application fournit son propre déclencheur. */
  trigger?: boolean;
  triggerLabel?: string;

  /** Raccourci ⌘K / Ctrl+K. */
  shortcut?: boolean;
  shortcutLabel?: string;

  /**
   * Termes déjà recherchés, proposés tant que la saisie est vide — la plus récente en premier.
   * La persistance et l'ordre restent à la charge de l'appelant : le composant ne fait que
   * les afficher. Masqué dès qu'une saisie est en cours, pour laisser place aux résultats.
   */
  history?: string[];
  /** Clic sur une entrée d'historique : à l'appelant de relancer la recherche sur ce terme. */
  onHistorySelect?: (term: string) => void;
  /** Sans ce callback, aucune entrée d'historique n'affiche sa croix de suppression. */
  onHistoryRemove?: (term: string) => void;
  /** Intitulé du groupe d'historique. */
  historyHeading?: string;
  /** Libellé accessible de la croix qui retire une entrée de l'historique. */
  removeFromHistoryLabel?: string;

  placeholder?: string;
  emptyLabel?: string;
  loadingLabel?: string;
  title?: string;
  description?: string;
  /** Ligne d'aide sous la liste, visible seulement quand il y a des résultats. */
  hint?: React.ReactNode;

  className?: string;
}

/**
 * Recherche globale : un bouton loupe qui ouvre une palette de commande
 * (⌘K / Ctrl+K) listant des résultats groupés.
 *
 * Le composant ne sait rien des données : il affiche les `groups` qu'on lui donne,
 * remonte la saisie via `onSearch` et la sélection via `onSelect`. Les requêtes,
 * le filtrage (pages, droits) et la navigation restent dans l'application.
 *
 * Le filtrage interne de cmdk est désactivé (`shouldFilter={false}`) : les résultats
 * arrivent déjà filtrés en amont — côté serveur pour les données, sans accents pour
 * les pages — et cmdk en masquerait une partie en refiltrant sur la saisie brute.
 *
 * Tant que la saisie est vide, l'historique (`history`) est proposé : chaque terme
 * relance une recherche (`onHistorySelect`) et peut être retiré via sa croix
 * (`onHistoryRemove`). Sa persistance reste à la charge de l'appelant.
 */
export const GlobalSearch = ({
  groups,
  search,
  onSearch,
  onSelect,
  loading = false,
  open,
  onOpenChange,
  trigger = true,
  triggerLabel,
  shortcut = true,
  shortcutLabel = "Ctrl+K",
  history,
  onHistorySelect,
  onHistoryRemove,
  historyHeading,
  removeFromHistoryLabel,
  placeholder,
  emptyLabel,
  loadingLabel,
  title,
  description,
  hint,
  className,
}: GlobalSearchProps): React.ReactElement => {
  const { t } = useKrosoftTranslation();
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncontrolledOpen;

  const setOpen = React.useCallback(
    (value: boolean): void => {
      if (!isControlled) {
        setUncontrolledOpen(value);
      }
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange],
  );

  // ⌘K / Ctrl+K : raccourci habituel des palettes de commande.
  React.useEffect(() => {
    if (!shortcut) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      setOpen(!isOpen);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcut, isOpen, setOpen]);

  const handleSelect = (item: GlobalSearchItem): void => {
    setOpen(false);
    onSearch("");
    onSelect(item);
  };

  const hasResults = groups.some(group => group.items.length > 0);
  // L'historique n'a de sens qu'au démarrage de la recherche : dès qu'on saisit, place aux résultats.
  const historyEntries = history ?? [];
  const showHistory = search.trim() === "" && historyEntries.length > 0;

  return (
    <>
      {trigger && (
        <Button
          variant="ghost"
          size="icon"
          aria-label={triggerLabel ?? t("search.trigger")}
          title={shortcut ? `${triggerLabel ?? t("search.trigger")} (${shortcutLabel})` : (triggerLabel ?? t("search.trigger"))}
          className="rounded-full"
          onClick={() => {
            setOpen(true);
          }}
        >
          <SearchIcon className="size-4" />
        </Button>
      )}

      <CommandDialog
        open={isOpen}
        onOpenChange={setOpen}
        title={title ?? t("search.globalTitle")}
        description={description ?? t("search.globalDescription")}
        shouldFilter={false}
        className={className}
      >
        <CommandInput value={search} onValueChange={onSearch} placeholder={placeholder ?? t("search.placeholder")} />
        <CommandList>
          {loading && (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
              <LoaderCircleIcon className="size-4 animate-spin" />
              {loadingLabel ?? t("search.loading")}
            </div>
          )}

          {!hasResults && !showHistory && !loading && <CommandEmpty>{emptyLabel ?? t("states.noResultDot")}</CommandEmpty>}

          {showHistory && (
            <CommandGroup heading={historyHeading ?? t("search.historyTitle")}>
              {historyEntries.map(term => (
                <CommandItem
                  key={`history-${term}`}
                  value={`history-${term}`}
                  className="gap-3 px-2 py-2"
                  onSelect={() => {
                    onHistorySelect?.(term);
                  }}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <ClockIcon className="size-4" />
                  </span>

                  <span className="min-w-0 flex-1 truncate font-medium">{term}</span>

                  {onHistoryRemove && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                      aria-label={removeFromHistoryLabel ?? t("search.removeFromHistory")}
                      title={removeFromHistoryLabel ?? t("search.removeFromHistory")}
                      // cmdk sélectionne l'item au clic : on stoppe la propagation pour ne retirer
                      // que l'entrée, et on évite que le `pointerdown` ne vole le focus de la saisie.
                      onPointerDown={event => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      onClick={event => {
                        event.stopPropagation();
                        onHistoryRemove(term);
                      }}
                    >
                      <XIcon className="size-4" />
                    </Button>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {groups.map(group =>
            group.items.length === 0 ? null : (
              <CommandGroup key={group.heading} heading={group.heading}>
                {group.items.map(item => {
                  const Icon = item.icon;

                  return (
                    <CommandItem
                      key={item.key}
                      value={item.key}
                      className="gap-3 px-2 py-2"
                      onSelect={() => {
                        handleSelect(item);
                      }}
                    >
                      {Icon && (
                        <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground", item.iconClassName)}>
                          <Icon className="size-4" />
                        </span>
                      )}

                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate font-medium">{item.label}</span>
                        {item.description !== undefined && item.description !== "" && (
                          <span className="truncate text-xs text-muted-foreground">{item.description}</span>
                        )}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ),
          )}
        </CommandList>

        {hint !== undefined && hasResults && !loading && <div className="border-t border-border p-2 text-center text-xs text-muted-foreground">{hint}</div>}
      </CommandDialog>
    </>
  );
};
