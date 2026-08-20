import { XIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      // Croix maison plutôt que le SVG 12px de sonner, pour rester aligné sur les autres icônes.
      icons={{ close: <XIcon className="size-4" /> }}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          // Sonner colle par défaut une pastille cerclée en absolu au coin du toast. On la
          // remet dans le flux (`order-last`) pour qu'elle se pose après le bouton d'action.
          // Le `!` est indispensable : les règles de sonner sont plus spécifiques que ces classes.
          closeButton:
            "!static !order-last !size-6 !transform-none !rounded-control !border-0 !bg-transparent !text-foreground/60 !opacity-100 hover:!bg-muted hover:!text-foreground focus-visible:!ring-2 focus-visible:!ring-ring",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
