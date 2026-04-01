import { defineConfig } from "vite";
import { fileURLToPath } from "url";

const entry = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  build: {
    lib: {
      entry: {
        "helpers/index": entry("src/helpers/index.ts"),
        "hooks/index": entry("src/hooks/index.ts"),
        "components/ui/index": entry("src/components/ui/index.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
    },
  },
});
