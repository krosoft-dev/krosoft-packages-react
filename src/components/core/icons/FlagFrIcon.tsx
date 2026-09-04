import type { JSX } from "react";

interface FlagIconProps {
  /** Taille/forme de l'icône, typiquement `size-4` depuis la surface qui l'accueille. */
  className?: string;
}

/**
 * Drapeau français, dessiné en SVG.
 *
 * Les emoji drapeaux (🇫🇷) ne conviennent pas : sous Windows ils retombent sur les
 * deux lettres du code pays (« FR ») faute de glyphe drapeau. Un SVG s'affiche partout.
 *
 * `slice` remplit une case carrée (`size-4`) en rognant symétriquement les bords,
 * plutôt que de laisser le drapeau flotter au centre d'un cadre trop haut.
 */
export const FlagFrIcon = ({ className }: FlagIconProps): JSX.Element => (
  <svg viewBox="0 0 640 480" preserveAspectRatio="xMidYMid slice" className={`rounded-[2px] ${className ?? ""}`} aria-hidden="true">
    <rect width="640" height="480" fill="#fff" />
    <rect width="213.34" height="480" fill="#002395" />
    <rect x="426.66" width="213.34" height="480" fill="#ED2939" />
  </svg>
);
