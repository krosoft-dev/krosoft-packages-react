import { useId, type JSX } from "react";

interface FlagIconProps {
  /** Taille/forme de l'icône, typiquement `size-4` depuis la surface qui l'accueille. */
  className?: string;
}

/**
 * Drapeau du Royaume-Uni (Union Jack), dessiné en SVG.
 *
 * Le tracé est le motif compact standard : croix de Saint-Georges (rouge) et de
 * Saint-André / Saint-Patrick (blanc et rouge décalés). Comme {@link FlagFrIcon}, un
 * SVG évite le repli en lettres des emoji drapeaux sous Windows.
 *
 * Les `clipPath` reçoivent un identifiant unique par instance (`useId`) : un id fixe se
 * dupliquerait si plusieurs drapeaux étaient rendus sur la même page, et le premier
 * gagnerait pour tous.
 */
export const FlagGbIcon = ({ className }: FlagIconProps): JSX.Element => {
  const uid = useId().replace(/:/g, "");
  const clipField = `flag-gb-field-${uid}`;
  const clipSaltire = `flag-gb-saltire-${uid}`;

  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" className={`rounded-[2px] ${className ?? ""}`} aria-hidden="true">
      <clipPath id={clipField}>
        <path d="M0 0v30h60V0z" />
      </clipPath>
      <clipPath id={clipSaltire}>
        <path d="M30 15h30v15zv15H0zH0v-15zv-15h30z" />
      </clipPath>
      <g clipPath={`url(#${clipField})`}>
        <path d="M0 0v30h60V0z" fill="#012169" />
        <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
        <path d="M0 0l60 30m0-30L0 30" clipPath={`url(#${clipSaltire})`} stroke="#C8102E" strokeWidth="4" />
        <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
        <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
};
