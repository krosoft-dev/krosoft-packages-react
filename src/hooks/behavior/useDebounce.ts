import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Retarde la propagation d'une valeur, et expose un `flush` pour l'appliquer immédiatement
 * quand l'utilisateur déclenche une action explicite qui ne doit pas paraître en retard
 * (réinitialisation d'un filtre, par exemple).
 */
export const useDebounce = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [value, delay]);

  const flush = useCallback((immediateValue: T) => {
    clearTimeout(timeoutRef.current);
    setDebouncedValue(immediateValue);
  }, []);

  return [debouncedValue, flush] as const;
};
