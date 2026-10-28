/**
 * Fige la date du jour (`new Date()` sans argument) pour forcer une période saisonnière.
 * À passer à `beforeEach` : la fonction renvoyée restaure la vraie `Date` à la sortie de la story.
 */
export const mockToday =
  (isoDate: string): (() => () => void) =>
  () => {
    const RealDate = globalThis.Date;
    const today = new RealDate(`${isoDate}T12:00:00`).getTime();

    class MockDate extends RealDate {
      constructor(...args: [] | [string | number | Date]) {
        if (args.length === 0) {
          super(today);
        } else {
          super(args[0]);
        }
      }
    }

    globalThis.Date = MockDate as DateConstructor;

    return () => {
      globalThis.Date = RealDate;
    };
  };
