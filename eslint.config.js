import { createReactConfig } from "@krosoft/tooling-eslint-react";

export default [
  { ignores: ["*.config.js", "*.config.ts"] },
  ...createReactConfig({
    tsconfigRootDir: import.meta.dirname,
    project: ["./tsconfig.eslint.json"],
  }),
  {
    // tailwind-merge types are not fully resolvable by TypeScript-ESLint in strict mode
    files: ["src/helpers/tailwind.helper.ts"],
    rules: {
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
    },
  },
];
