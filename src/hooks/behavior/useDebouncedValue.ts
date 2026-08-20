import * as React from "react";

/**
 * Retourne `value` après `delay` ms sans nouveau changement.
 * Évite de lancer une requête à chaque frappe dans un champ de recherche.
 */
export const useDebouncedValue = <T>(value: T, delay = 250): T => {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debounced;
};
