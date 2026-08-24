import { format, parse } from "date-fns";
import { useCallback } from "react";
import { DateRange } from "react-day-picker";
import { useSearchParams } from "react-router-dom";

/** Format des dates en URL : compact et lisible. */
export const URL_DATE_FORMAT = "yyyy-MM-dd";

/**
 * Hook to synchronize state with URL search parameters.
 * @param key - URL parameter key
 * @param defaultValue - Default value when parameter is not in URL
 * @param parser - Optional function to parse string value to T
 * @param serializer - Optional function to serialize T to string
 */
export function useUrlState<T>(key: string, defaultValue: T, parser?: (value: string) => T, serializer?: (value: T) => string): [T, (value: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawValue = searchParams.get(key);

  let value: T;
  if (rawValue === null) {
    value = defaultValue;
  } else if (parser) {
    value = parser(rawValue);
  } else {
    value = rawValue as unknown as T;
  }

  const setValue = useCallback(
    (newValue: T) => {
      setSearchParams(
        params => {
          const serialized = serializer ? serializer(newValue) : String(newValue);
          const defaultSerialized = serializer ? serializer(defaultValue) : String(defaultValue);

          if (serialized === defaultSerialized || serialized === "" || serialized === "undefined") {
            params.delete(key);
          } else {
            params.set(key, serialized);
          }
          return params;
        },
        { replace: true },
      );
    },
    [key, defaultValue, serializer, setSearchParams],
  );

  return [value, setValue];
}

/**
 * Hook for string array URL state (comma-separated).
 */
export function useUrlArrayState(key: string, defaultValue: string[] = []): [string[], (value: string[]) => void] {
  return useUrlState<string[]>(
    key,
    defaultValue,
    value => (value ? value.split(",").filter(Boolean) : []),
    value => value.join(","),
  );
}

/**
 * Hook for number URL state.
 */
export function useUrlNumberState(key: string, defaultValue: number): [number, (value: number) => void] {
  return useUrlState<number>(
    key,
    defaultValue,
    value => parseInt(value, 10) || defaultValue,
    value => value.toString(),
  );
}

/** Analyse une plage de dates au format `from_to` (chaque borne en `yyyy-MM-dd`). */
export const parseDateRange = (value: string): DateRange | undefined => {
  if (!value) {
    return undefined;
  }

  const [fromStr, toStr] = value.split("_");
  const from = fromStr ? parse(fromStr, URL_DATE_FORMAT, new Date()) : undefined;
  if (!from || isNaN(from.getTime())) {
    return undefined;
  }

  const to = toStr ? parse(toStr, URL_DATE_FORMAT, new Date()) : undefined;
  return { from, to: to && !isNaN(to.getTime()) ? to : undefined };
};

/** Sérialise une plage de dates en `from_to` (borne haute omise si absente). */
export const serializeDateRange = (range: DateRange | undefined): string => {
  if (!range?.from) {
    return "";
  }

  const fromStr = format(range.from, URL_DATE_FORMAT);
  const toStr = range.to ? format(range.to, URL_DATE_FORMAT) : "";
  return toStr ? `${fromStr}_${toStr}` : fromStr;
};

/**
 * Hook for date range URL state (from_to, dates formatted as yyyy-MM-dd).
 */
export function useUrlDateRangeState(key: string): [DateRange | undefined, (value: DateRange | undefined) => void] {
  return useUrlState<DateRange | undefined>(key, undefined, parseDateRange, serializeDateRange);
}
