import baseConfig, { restrictEnvAccess } from "@henry/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**", "drizzle/**"],
  },
  ...baseConfig,
  ...restrictEnvAccess,
];
