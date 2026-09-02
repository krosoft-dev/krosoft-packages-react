import type { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

/**
 * Variants du `Button`, dérivés de `buttonVariants` : un variant ajouté au composant
 * devient utilisable partout où ce type est attendu, sans recopie à tenir à jour.
 *
 * L'import est effacé à la compilation (`import type`) : aucune dépendance de `types` vers `components` à l'exécution.
 */
export type ButtonVariantType = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
