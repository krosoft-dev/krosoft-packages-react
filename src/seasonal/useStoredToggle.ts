import { useCallback, useSyncExternalStore } from "react";

const CHANGE_EVENT = "krosoft-seasonal-change";

const readEnabled = (storageKey: string): boolean => {
  try {
    // Activé par défaut : seul un refus explicite est mémorisé.
    return localStorage.getItem(storageKey) !== "false";
  } catch {
    return true;
  }
};

const subscribe = (onChange: () => void): (() => void) => {
  // `storage` couvre les autres onglets, l'événement maison les autres composants de l'onglet courant.
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
};

/** Préférence booléenne persistée dans le localStorage, partagée entre composants et onglets. */
export const useStoredToggle = (storageKey: string): [boolean, (enabled: boolean) => void] => {
  const getSnapshot = useCallback(() => readEnabled(storageKey), [storageKey]);
  const enabled = useSyncExternalStore(subscribe, getSnapshot, () => true);

  const setEnabled = useCallback(
    (value: boolean) => {
      try {
        localStorage.setItem(storageKey, String(value));
      } catch {
        // Stockage indisponible : la préférence ne sera pas conservée.
      }
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [storageKey],
  );

  return [enabled, setEnabled];
};
