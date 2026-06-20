import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";

const srcDir = fileURLToPath(new URL("src", import.meta.url));

export default defineConfig({
  test: {
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "@": srcDir,
    },
  },
});
