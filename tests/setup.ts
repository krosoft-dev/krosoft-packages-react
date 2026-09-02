// Polyfills jsdom requis par les panneaux cmdk (MultiSelect, SingleSelect searchable) :
// cmdk observe la liste pour recalculer l'item actif et le fait défiler dans la vue.
globalThis.ResizeObserver ??= class {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
};

// Ce fichier tourne aussi devant les suites en environnement `node`, où `Element` n'existe pas.
// Écrasement inconditionnel ensuite : jsdom ne fournit pas `scrollIntoView`, et le lire pour
// tester sa présence déclenche `@typescript-eslint/unbound-method`.
if (typeof Element !== "undefined") {
  Element.prototype.scrollIntoView = (): void => {};
}
