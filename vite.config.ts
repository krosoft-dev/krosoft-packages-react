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
const peerDeps = Object.keys(pkg.peerDependencies || {});
const externalPattern = new RegExp(`^(${[...peerDeps, "react-dom", "react/jsx-runtime"].map(d => d.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(/.*)?$`);

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
