import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { usersInAuth } from "./auth";

export const post = pgTable("post", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at", { mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true, mode: "string" }),
  user_id: uuid("user_id").references(() => usersInAuth.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});
