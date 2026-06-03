import { defineConfig } from "vite";
import { globSync } from "tinyglobby";
import { fileURLToPath } from "url";
import path from "path";
import { readFileSync } from "fs";

const srcDir = fileURLToPath(new URL("src", import.meta.url));

const entries = Object.fromEntries(
  globSync("src/**/index.ts").map(file => {
    const key = path.relative("src", file).replace(/\.ts$/, "");
    return [key, fileURLToPath(new URL(file, import.meta.url))];
  }),
);

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

// Externaliser TOUTES les dependencies et peerDependencies.
// Une librairie ne doit bundler que son propre code source,
// pas ses dépendances tierces (radix-ui, recharts, zod, etc.)
const allDeps = [
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.dependencies || {}),
  "react-dom",
  "react/jsx-runtime",
];
const externalPattern = new RegExp(`^(${allDeps.map(d => d.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(/.*)?$`);

export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  build: {
    lib: {
      entry: entries,
      formats: ["es"],
    },
    rollupOptions: {
      external: id => externalPattern.test(id),
    },
  },
  resolve: {
    alias: {
      "@": srcDir,
    },
  },
});
