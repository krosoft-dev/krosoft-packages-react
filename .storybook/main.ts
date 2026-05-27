/* eslint-disable @typescript-eslint/naming-convention */
import type { StorybookConfig } from "@storybook/react-vite";
import { fileURLToPath } from "url";

const srcDir = fileURLToPath(new URL("../src", import.meta.url));

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-themes", "@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: config => {
    const alias = config.resolve?.alias;

    if (Array.isArray(alias)) {
      alias.push({ find: "@", replacement: srcDir });
    } else {
      config.resolve = {
        ...config.resolve,
        alias: {
          ...(alias as Record<string, string>),
          "@": srcDir,
        },
      };
    }
    return config;
  },
};

export default config;
