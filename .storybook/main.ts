/* eslint-disable @typescript-eslint/naming-convention */
import type { StorybookConfig } from "@storybook/react-vite";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "url";

const srcDir = fileURLToPath(new URL("../src", import.meta.url));

const { version } = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as { version: string };

// Le site déployé suit `main`, pas une version npm : on affiche aussi de quoi
// identifier le build. Azure DevOps et GitHub Actions exposent le commit dans
// l'environnement du job ; en local il n'y a rien à afficher.
const commit = process.env.BUILD_SOURCEVERSION ?? process.env.GITHUB_SHA ?? "";
const buildDate = new Date().toISOString();

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-themes", "@storybook/addon-docs"],
  staticDirs: ["./public"],
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

    config.define = {
      ...config.define,
      __KROSOFT_VERSION__: JSON.stringify(version),
      __KROSOFT_COMMIT__: JSON.stringify(commit),
      __KROSOFT_BUILD_DATE__: JSON.stringify(buildDate),
    };

    return config;
  },
};

export default config;
