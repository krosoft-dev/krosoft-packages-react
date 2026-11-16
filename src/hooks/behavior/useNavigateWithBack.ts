import type React from "react";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { buildBackState } from "@/helpers/navigation.helper";

/**
 * Navigue vers `url` en transmettant l'URL courante comme URL de retour (lue par `useBackNavigation`).
 * Ctrl/Cmd + clic ouvre l'URL dans un nouvel onglet, comme un lien natif.
 */
export function useNavigateWithBack(): (url: string, event?: React.MouseEvent) => void {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (url: string, event?: React.MouseEvent) => {
      if (event?.ctrlKey === true || event?.metaKey === true) {
        window.open(url, "_blank");
        return;
      }
      void navigate(url, { state: buildBackState(location) });
    },
    [navigate, location],
  );
}
