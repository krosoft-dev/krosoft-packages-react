/**
 * Plage de dates exposée par la librairie. Type maison volontairement isolé de `react-day-picker`
 * (utilisé en interne par les composants) : un changement de cette dépendance n'impacte pas l'API.
 */
export interface DateRangeValue {
  from?: Date;
  to?: Date;
}
