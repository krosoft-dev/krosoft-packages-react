import { defineConfig } from "vite";
import { globSync } from "tinyglobby";
import { fileURLToPath } from "url";
import path from "path";

const srcDir = fileURLToPath(new URL("src", import.meta.url));

const entries = Object.fromEntries(
  globSync("src/**/index.ts").map((file) => {
    const key = path.relative("src", file).replace(/\.ts$/, "");
    return [key, fileURLToPath(new URL(file, import.meta.url))];
  })
);

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
      external: ["react", "react-dom", "react/jsx-runtime"],
    },
  },
  resolve: {
    alias: {
      "@": srcDir,
    },
  },
});
