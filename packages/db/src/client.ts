import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import * as schemas from "./schemas";

export const db = drizzle(sql, { schema: { ...schemas } });
