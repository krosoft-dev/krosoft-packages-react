import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isBackNavigationState } from "@/helpers/navigation.helper";

/**
 * Retour vers l'URL d'origine transmise dans `location.state.from` (voir `buildBackState`),
 * ou vers `fallbackPath` quand la page a été ouverte directement.
 * L'URL d'origine est mémorisée tant que le pathname ne change pas : un `setSearchParams` sans state
 * (onglets, filtres) ne la perd pas.
 */
export function useBackNavigation(fallbackPath: string): () => void {
  const navigate = useNavigate();
  const { pathname, state } = useLocation() as { pathname: string; state: unknown };
  const stateFrom = isBackNavigationState(state) ? state.from : undefined;
  const [origin, setOrigin] = useState({ pathname, from: stateFrom });

  if (origin.pathname !== pathname || (stateFrom !== undefined && stateFrom !== origin.from)) {
    setOrigin({ pathname, from: stateFrom });
  }

  const target = (origin.pathname === pathname ? origin.from : stateFrom) ?? fallbackPath;

  return useCallback(() => {
    void navigate(target);
  }, [navigate, target]);
}
