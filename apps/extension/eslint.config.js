import baseConfig, { restrictEnvAccess } from "@henry/eslint-config/base";
import reactConfig from "@henry/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".plasmo/**", "build/**"],
  },
  ...baseConfig,
  ...reactConfig,
];
