// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { createReactConfig } from "@krosoft/tooling-eslint-react";

export default [{ ignores: ["*.config.js", "*.config.ts"] }, ...createReactConfig({
  tsconfigRootDir: import.meta.dirname,
  project: ["./tsconfig.eslint.json"],
}), {
  // tailwind-merge types are not fully resolvable by TypeScript-ESLint in strict mode
  files: ["src/helpers/tailwind.helper.ts"],
  rules: {
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-return": "off",
  },
}, ...storybook.configs["flat/recommended"]];
