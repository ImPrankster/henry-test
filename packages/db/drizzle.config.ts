import type { Config } from "drizzle-kit";

import { env } from "./src/env.js";

export default {
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: env.POSTGRES_URL },
} satisfies Config;
