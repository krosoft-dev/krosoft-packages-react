/**
 * Cible d'alias pour `virtual:pwa-register/react` sous Vitest.
 *
 * Le vrai module est fabriqué par vite-plugin-pwa dans l'application hôte : il
 * n'existe pas hors d'un build Vite. Sans cet alias, `vi.mock` échouerait à
 * résoudre l'identifiant avant même d'appliquer sa fabrique.
 */
export const useRegisterSW = (): never => {
  throw new Error("useRegisterSW doit être remplacé par vi.mock dans les tests.");
};
