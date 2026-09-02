import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";

const srcDir = fileURLToPath(new URL("src", import.meta.url));
// `virtual:pwa-register/react` n'existe que dans un build Vite de l'application hôte.
// Lui donner une cible réelle permet à `vi.mock` de le remplacer dans les tests.
const virtualPwaRegister = fileURLToPath(new URL("tests/pwa/virtualPwaRegister.ts", import.meta.url));

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
  },
  resolve: {
    alias: {
      "@": srcDir,
      "virtual:pwa-register/react": virtualPwaRegister,
    },
  },
});
