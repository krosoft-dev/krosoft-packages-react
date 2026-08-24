import { useKrosoftTranslation } from "@/i18n";
import { cn } from "@/helpers/tailwind.helper";
import { type DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";
import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./dialog";

const Command = React.forwardRef<React.ElementRef<typeof CommandPrimitive>, React.ComponentPropsWithoutRef<typeof CommandPrimitive>>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive
      ref={ref}
      className={cn("flex h-full w-full flex-col overflow-hidden rounded-surface bg-popover text-popover-foreground", className)}
      {...props}
    />
  ),
);
Command.displayName = CommandPrimitive.displayName;

export interface CommandDialogProps extends DialogProps {
  /** Titre de la palette, en `sr-only` : Radix exige un titre sur toute Dialog. */
  title?: string;
  /** Description de la palette, en `sr-only`, pour les lecteurs d'écran. */
  description?: string;
  /**
   * `false` désactive le filtrage interne de cmdk : les items rendus sont exactement
   * ceux passés en enfants. Indispensable quand le filtrage est fait en amont
   * (côté serveur, ou insensible aux accents) — sinon cmdk masque des résultats déjà filtrés.
   */
  shouldFilter?: boolean;
  /** Classes ajoutées au `Command` interne. */
  className?: string;
}

/**
 * Palette de commandes : une `Command` dans une `Dialog`.
 *
 * Le dimensionnement des icônes des items n'est pas imposé — chaque item garde
 * les classes qu'on lui donne (`size-4`, `size-5`…).
 *
 * Sur mobile la dialog occupe tout l'écran : la colonne flex laisse la liste
 * prendre la hauteur restante (`flex-1`, plafond de 300px levé) au lieu de
 * s'arrêter au tiers de l'écran, la saisie restant en haut et le `hint` en bas.
 * À partir de `sm`, la dialog reprend sa hauteur automatique et la liste son
 * plafond habituel.
 */
const CommandDialog = ({ title, description, shouldFilter, className, children, ...props }: CommandDialogProps): React.ReactElement => {
  const { t } = useKrosoftTranslation();
  return (
    <Dialog {...props}>
      <DialogContent className="flex flex-col overflow-hidden p-0 shadow-lg">
        <DialogTitle className="sr-only">{title ?? t("search.commandTitle")}</DialogTitle>
        <DialogDescription className="sr-only">{description ?? t("search.commandDescription")}</DialogDescription>
        <Command
          shouldFilter={shouldFilter}
          className={cn(
            "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3",
            "[&_[cmdk-list]]:max-h-none [&_[cmdk-list]]:min-h-0 [&_[cmdk-list]]:flex-1 sm:[&_[cmdk-list]]:max-h-[300px] sm:[&_[cmdk-list]]:flex-none",
            className,
          )}
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Input>, React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>>(
  ({ className, ...props }, ref) => (
    <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
      <SearchIcon className="mr-2 size-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-control bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  ),
);

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<React.ElementRef<typeof CommandPrimitive.List>, React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>>(
  ({ className, ...props }, ref) => <CommandPrimitive.List ref={ref} className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)} {...props} />,
);

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Empty>, React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>>(
  (props, ref) => <CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm" {...props} />,
);

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Group>, React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.Group
      ref={ref}
      className={cn(
        "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
);

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => <CommandPrimitive.Separator ref={ref} className={cn("-mx-1 h-px bg-border", className)} {...props} />);
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Item>, React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />;
};
CommandShortcut.displayName = "CommandShortcut";

export { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut };
