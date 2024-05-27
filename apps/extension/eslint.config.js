import baseConfig, { restrictEnvAccess } from "@henry/eslint-config/base";
import nextjsConfig from "@henry/eslint-config/nextjs";
import reactConfig from "@henry/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
