/* eslint-disable @typescript-eslint/naming-convention */
import type { StorybookConfig } from "@storybook/react-vite";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "url";

const srcDir = fileURLToPath(new URL("../src", import.meta.url));

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
  name: string;
  version: string;
};

// `package.json` reste figé (0.0.1) : le pipeline de publication calcule la version
// au moment du publish (dernière version du registre + 1 patch) et ne la recommite
// jamais. Pour afficher la vraie version, on interroge donc npm au build.
// `KROSOFT_NPM_VERSION` permet de forcer la valeur (CI, build hors ligne).
const resolvePublishedVersion = (): string => {
  if (process.env.KROSOFT_NPM_VERSION) {
    return process.env.KROSOFT_NPM_VERSION;
  }

  try {
    const npm = process.platform === "win32" ? "npm.cmd" : "npm";
    const published = execFileSync(npm, ["view", pkg.name, "version"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 20_000,
    }).trim();

    if (published) {
      return published;
    }
  } catch {
    // Registre injoignable (hors ligne, proxy) : on retombe sur la version du dépôt.
  }

  return pkg.version;
};

const version = resolvePublishedVersion();

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
  // Le manager n'est pas construit par Vite : il ne voit pas les `define`
  // ci-dessous, on lui passe donc la version par le `<head>`.
  managerHead: head => `${head}\n<script>window.__KROSOFT_VERSION__ = ${JSON.stringify(version)};</script>`,
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
