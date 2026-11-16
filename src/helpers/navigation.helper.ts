import type { BackNavigationState } from "@/types/BackNavigationState";
import type { Location } from "react-router-dom";

/** Construit le state à passer à `navigate`/`Link` pour que la page cible puisse revenir à l'URL courante. */
export const buildBackState = (location: Pick<Location, "pathname" | "search">): BackNavigationState => ({
  from: location.pathname + location.search,
});

/** Indique si un `location.state` inconnu porte une URL de retour. */
export const isBackNavigationState = (state: unknown): state is BackNavigationState =>
  typeof state === "object" && state !== null && "from" in state && typeof state.from === "string";
