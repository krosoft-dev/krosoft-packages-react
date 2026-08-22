import { useKrosoftTranslation } from "@/i18n";
import { cn } from "@/helpers/tailwind.helper";
import { BellIcon, Trash2Icon } from "lucide-react";
import * as React from "react";
import { Button } from "../../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { ScrollArea } from "../../ui/scroll-area";

export interface NotificationItem {
  /** Identifiant stable de l'entrée : sert de clé React et de repère aux callbacks. */
  key: string;
  title: string;
  /** Corps du message, sur une seconde ligne. */
  description?: string;
  /**
   * Horodatage déjà mis en forme par l'application : le formatage dépend de la locale et du
   * fuseau du projet, le composant ne fait que l'afficher.
   */
  date?: string;
  /** Une entrée non lue est mise en avant et compte dans la pastille. */
  read?: boolean;
  icon?: React.ElementType;
  /**
   * Classes de la pastille d'icône : fond et couleur du glyphe, qui hérite de `currentColor`
   * — par exemple `"bg-blue-500/10 text-blue-500"`. Sans valeur, la pastille est neutre.
   */
  iconClassName?: string;
  /** Chemin de destination, laissé à la charge de l'appelant dans `onSelect`. */
  path?: string;
}

export interface NotificationsBellProps {
  /** Entrées déjà ordonnées par l'appelant, la plus récente en premier. */
  items: NotificationItem[];

  /** Clic sur une entrée : à l'appelant d'ouvrir la page concernée et de la marquer comme lue. */
  onSelect?: (item: NotificationItem) => void;
  /** Sans ce callback, l'action « tout marquer comme lu » n'est pas proposée. */
  onMarkAllAsRead?: () => void;
  /** Sans ce callback, aucune entrée n'affiche de bouton de suppression. */
  onRemove?: (item: NotificationItem) => void;

  loading?: boolean;

  /**
   * Compteur de la pastille. Par défaut, le nombre d'entrées non lues — à renseigner quand la
   * liste est tronquée côté application et que le total réel est plus grand.
   */
  unreadCount?: number;
  /** Au-delà, le compteur s'affiche « 9+ ». */
  maxBadgeCount?: number;

  /** Mode contrôlé : sans ces props, le panneau gère son ouverture lui-même. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  triggerLabel?: string;
  title?: string;
  emptyLabel?: string;
  loadingLabel?: string;
  markAllAsReadLabel?: string;
  removeLabel?: string;

  className?: string;
  /** Classes du panneau : sa largeur par défaut convient rarement à tous les projets. */
  contentClassName?: string;
  /** Classes de la pastille de comptage, pour l'accorder à la charte de l'application. */
  badgeClassName?: string;
}

const DEFAULT_MAX_BADGE_COUNT = 9;

/**
 * Cloche de notifications : pastille de comptage et panneau listant les messages reçus.
 *
 * Purement présentationnel — ni chargement, ni persistance, ni navigation : l'application fournit
 * les entrées et décide de ce que fait un clic. C'est ce qui lui permet de servir aussi bien un
 * historique stocké en base qu'une liste tenue en mémoire.
 */
export const NotificationsBell = ({
  items,
  onSelect,
  onMarkAllAsRead,
  onRemove,
  loading = false,
  unreadCount,
  maxBadgeCount = DEFAULT_MAX_BADGE_COUNT,
  open,
  onOpenChange,
  triggerLabel,
  title,
  emptyLabel,
  loadingLabel,
  markAllAsReadLabel,
  removeLabel,
  className,
  contentClassName,
  badgeClassName,
}: NotificationsBellProps): React.ReactElement => {
  const { t } = useKrosoftTranslation();
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncontrolledOpen;

  const handleOpenChange = (next: boolean): void => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const count = unreadCount ?? items.filter(item => !item.read).length;
  const label = triggerLabel ?? t("notifications.trigger");

  const handleSelect = (item: NotificationItem): void => {
    handleOpenChange(false);
    onSelect?.(item);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("relative rounded-full", className)}
          aria-label={count > 0 ? `${label} (${String(count)})` : label}
          title={label}
        >
          <BellIcon className="size-4" />
          {count > 0 && (
            <span
              className={cn(
                "absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold leading-none text-primary-foreground",
                badgeClassName,
              )}
            >
              {count > maxBadgeCount ? `${String(maxBadgeCount)}+` : count}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className={cn("w-80 p-0", contentClassName)}>
        <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
          <span className="text-sm font-medium">{title ?? t("notifications.title")}</span>
          {onMarkAllAsRead && count > 0 && (
            <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={onMarkAllAsRead}>
              {markAllAsReadLabel ?? t("notifications.markAllAsRead")}
            </Button>
          )}
        </div>

        {loading && <p className="px-3 py-6 text-center text-sm text-muted-foreground">{loadingLabel ?? t("states.loading")}</p>}

        {!loading && items.length === 0 && <p className="px-3 py-6 text-center text-sm text-muted-foreground">{emptyLabel ?? t("notifications.empty")}</p>}

        {!loading && items.length > 0 && (
          <ScrollArea className="max-h-96">
            <ul className="divide-y">
              {items.map(item => {
                const Icon = item.icon;

                return (
                  <li key={item.key} className={cn("flex items-start gap-2 px-3 py-2", !item.read && "bg-accent/40")}>
                    {/* Toute la zone de texte est cliquable : c'est le geste attendu sur une
                        notification, le bouton de suppression restant à part pour ne pas être touché par erreur. */}
                    <button
                      type="button"
                      className="flex min-w-0 flex-1 items-start gap-2 rounded-sm text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      onClick={() => {
                        handleSelect(item);
                      }}
                    >
                      {Icon && (
                        <span
                          className={cn(
                            "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground",
                            item.iconClassName,
                          )}
                        >
                          <Icon className="size-3.5" />
                        </span>
                      )}

                      <span className="min-w-0 flex-1 space-y-0.5">
                        <span className="flex items-center gap-2">
                          {!item.read && <span className="size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />}
                          <span className={cn("truncate text-sm", !item.read && "font-medium")}>{item.title}</span>
                        </span>
                        {item.description && <span className="block text-xs text-muted-foreground">{item.description}</span>}
                        {item.date && <span className="block text-xs text-muted-foreground/60">{item.date}</span>}
                      </span>
                    </button>

                    {onRemove && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          onRemove(item);
                        }}
                        aria-label={removeLabel ?? t("notifications.remove")}
                        title={removeLabel ?? t("notifications.remove")}
                      >
                        <Trash2Icon className="size-3.5" />
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
};
