import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../helpers/tailwind.helper";
import { useScrollFade } from "../../hooks/ui/useScrollFade";

const Tabs = TabsPrimitive.Root;

const tabsListVariants = cva("text-muted-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", {
  variants: {
    variant: {
      // Soulignement de l'onglet actif, barre pleine largeur (style par défaut historique).
      line: "inline-flex h-10 w-full items-center justify-start gap-6 overflow-x-auto overscroll-x-contain border-b border-border bg-transparent p-0",
      // Segmenté « pilule » : conteneur arrondi sur fond atténué, onglet actif surélevé.
      solid: "inline-flex h-10 w-fit items-center justify-center gap-1 rounded-md bg-muted p-1",
    },
  },
  defaultVariants: {
    variant: "line",
  },
});

const tabsTriggerVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap text-sm font-medium text-muted-foreground ring-offset-background cursor-pointer transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground [&_svg]:h-4 [&_svg]:w-4",
  {
    variants: {
      variant: {
        line: "rounded-none border-b-2 border-transparent bg-transparent px-1 pb-2.5 pt-2 -mb-px data-[state=active]:border-primary data-[state=active]:shadow-none",
        solid: "rounded-sm px-3 py-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm",
      },
    },
    defaultVariants: {
      variant: "line",
    },
  },
);

type TabsVariant = NonNullable<VariantProps<typeof tabsListVariants>["variant"]>;

// La variante choisie sur TabsList est propagée aux TabsTrigger enfants, qui n'ont alors pas
// besoin de la redéclarer (mais peuvent toujours la surcharger via leur propre prop `variant`).
const TabsListVariantContext = React.createContext<TabsVariant>("line");

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>
>(({ className, style, variant, ...props }, ref) => {
  const resolvedVariant = variant ?? "line";
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
    <TabsListVariantContext.Provider value={resolvedVariant}>
      <TabsPrimitive.List
        ref={setRefs}
        style={{ ...style, ...fadeStyle }}
        // Les onglets qui ne tiennent pas dans la largeur défilent dans la liste au lieu d'élargir
        // la page : sur mobile, une liste plus large que l'écran rendait tout le layout scrollable
        // horizontalement (en-tête et contenu compris). overscroll-x-contain évite en plus que le
        // swipe sur les onglets déclenche le retour arrière du navigateur.
        // La scrollbar est masquée : haute de ~15px sur Windows, elle rognerait la barre (h-10).
        className={cn(tabsListVariants({ variant: resolvedVariant }), className)}
        {...props}
      />
    </TabsListVariantContext.Provider>
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & VariantProps<typeof tabsTriggerVariants>
>(({ className, variant, ...props }, ref) => {
  const listVariant = React.useContext(TabsListVariantContext);
  return <TabsPrimitive.Trigger ref={ref} className={cn(tabsTriggerVariants({ variant: variant ?? listVariant }), className)} {...props} />;
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Content
      ref={ref}
      className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}
      {...props}
    />
  ),
);
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants, tabsTriggerVariants };
