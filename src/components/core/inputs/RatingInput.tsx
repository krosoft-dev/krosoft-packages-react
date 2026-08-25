import { cn } from "@/helpers/tailwind.helper";
import { Heart, Star } from "lucide-react";

type RatingIcon = "heart" | "star";

interface RatingIconConfig {
  Icon: typeof Heart;
  /** Classes des symboles pleins. */
  filledClassName: string;
  /** Nom singulier utilisé dans les libellés d'accessibilité. */
  unit: string;
}

const ICONS: Record<RatingIcon, RatingIconConfig> = {
  heart: { Icon: Heart, filledClassName: "fill-rose-500 text-rose-500", unit: "cœur" },
  star: { Icon: Star, filledClassName: "fill-amber-400 text-amber-400", unit: "étoile" },
};

interface RatingInputProps {
  /** Valeur courante (0 à max). */
  value: number;
  /** Si fourni, le composant est éditable (clic = définir, re-clic sur la même valeur = remettre à 0). */
  onChange?: (value: number) => void;
  max?: number;
  size?: "sm" | "md";
  /** Symbole utilisé pour la note. Défaut : `star`. */
  icon?: RatingIcon;
  /** Classes appliquées aux symboles pleins, pour surcharger la couleur par défaut de l'icône. */
  colorClassName?: string;
  className?: string;
}

/** Note discrète (éditable ou lecture seule) : sélection d'une valeur de 0 à `max`, symbolisée par des étoiles ou des cœurs. */
export function RatingInput({ value, onChange, max = 5, size = "md", icon = "star", colorClassName, className }: RatingInputProps) {
  const { Icon, filledClassName, unit } = ICONS[icon];
  const readOnly = !onChange;
  const dim = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";
  const filledColor = colorClassName ?? filledClassName;

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role={readOnly ? "img" : undefined}
      aria-label={readOnly ? `${value}/${max} ${unit}${value > 1 ? "s" : ""}` : undefined}
    >
      {Array.from({ length: max }, (_, i) => {
        const idx = i + 1;
        const filled = idx <= value;
        const symbol = <Icon className={cn(dim, filled ? filledColor : "text-muted-foreground/40")} />;
        if (readOnly) return <span key={idx}>{symbol}</span>;
        return (
          <button
            key={idx}
            type="button"
            onClick={() => onChange?.(value === idx ? 0 : idx)}
            aria-label={`${idx} ${unit}${idx > 1 ? "s" : ""}`}
            className="leading-none transition-transform hover:scale-110"
          >
            {symbol}
          </button>
        );
      })}
    </div>
  );
}
