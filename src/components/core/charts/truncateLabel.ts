/** Tronque `value` à `maxLength` caractères suivis de « … ». `0` désactive la troncature. */
export const truncateLabel = (value: string, maxLength: number): string =>
  maxLength > 0 && value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;
