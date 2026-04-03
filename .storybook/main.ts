import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import path from "path";

const srcDir = fileURLToPath(new URL("../src", import.meta.url));
const mocksDir = fileURLToPath(new URL("./mocks", import.meta.url));

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    config.plugins = [...(config.plugins ?? []), tailwindcss()];
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        "@": srcDir,
        "react-i18next": path.resolve(mocksDir, "react-i18next.tsx"),
        "@krosoft/core/helpers": path.resolve(mocksDir, "krosoft-core-helpers.ts"),
      },
    };
    return config;
  },
};

export default config;
