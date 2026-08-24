import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../helpers/tailwind.helper";
import { useScrollFade } from "../../hooks/ui/useScrollFade";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(
  ({ className, style, ...props }, ref) => {
    // La liste défile : le fondu a besoin du noeud, en plus de la ref éventuellement posée par
    // l'appelant (AppTabs y recentre l'onglet actif).
    const listRef = React.useRef<HTMLDivElement | null>(null);
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        listRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );
    const fadeStyle = useScrollFade(listRef);

    return (
      <TabsPrimitive.List
        ref={setRefs}
        style={{ ...style, ...fadeStyle }}
        className={cn(
          // Les onglets qui ne tiennent pas dans la largeur défilent dans la liste au lieu d'élargir
          // la page : sur mobile, une liste plus large que l'écran rendait tout le layout scrollable
          // horizontalement (en-tête et contenu compris). overscroll-x-contain évite en plus que le
          // swipe sur les onglets déclenche le retour arrière du navigateur.
          // La scrollbar est masquée : haute de ~15px sur Windows, elle rognerait la barre (h-10).
          "inline-flex h-10 items-center justify-start gap-6 overflow-x-auto overscroll-x-contain border-b border-border bg-transparent p-0 text-muted-foreground w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          className,
        )}
        {...props}
      />
    );
  },
);
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-none border-b-2 border-transparent bg-transparent px-1 pb-2.5 pt-2 -mb-px text-sm font-medium text-muted-foreground ring-offset-background cursor-pointer transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none [&_svg]:h-4 [&_svg]:w-4",
        className,
      )}
      {...props}
    />
  ),
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    />
  ),
);
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
