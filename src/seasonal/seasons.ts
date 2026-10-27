/** Période de l'effet neige : tout le mois de décembre. */
export const isSnowSeason = (date: Date = new Date()): boolean => date.getMonth() === 11;

/** Période de l'effet Halloween : du 25 octobre au 2 novembre inclus. */
export const isHalloweenSeason = (date: Date = new Date()): boolean => {
  const month = date.getMonth();
  const day = date.getDate();
  return (month === 9 && day >= 25) || (month === 10 && day <= 2);
};
