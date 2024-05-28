import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgSchema,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const storage = pgSchema("storage");

export const objectsInStorage = storage.table(
  "objects",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    bucket_id: text("bucket_id").references(() => bucketsInStorage.id),
    name: text("name"),
    owner: uuid("owner"),
    created_at: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updated_at: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    last_accessed_at: timestamp("last_accessed_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    metadata: jsonb("metadata"),
    path_tokens: text("path_tokens").array(),
    version: text("version"),
    owner_id: text("owner_id"),
  },
  (table) => {
    return {
      bucketid_objname: uniqueIndex("bucketid_objname").on(
        table.bucket_id,
        table.name,
      ),
      name_prefix_search: index("name_prefix_search").on(table.name),
      idx_objects_bucket_id_name: index("idx_objects_bucket_id_name").on(
        table.bucket_id,
        table.name,
      ),
    };
  },
);

export const migrationsInStorage = storage.table(
  "migrations",
  {
    id: integer("id").primaryKey().notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    hash: varchar("hash", { length: 40 }).notNull(),
    executed_at: timestamp("executed_at", { mode: "string" }).defaultNow(),
  },
  (table) => {
    return {
      migrations_name_key: unique("migrations_name_key").on(table.name),
    };
  },
);

export const bucketsInStorage = storage.table(
  "buckets",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    owner: uuid("owner"),
    created_at: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updated_at: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    public: boolean("public").default(false),
    avif_autodetection: boolean("avif_autodetection").default(false),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    file_size_limit: bigint("file_size_limit", { mode: "number" }),
    allowed_mime_types: text("allowed_mime_types").array(),
    owner_id: text("owner_id"),
  },
  (table) => {
    return {
      bname: uniqueIndex("bname").on(table.name),
    };
  },
);

export const s3_multipart_uploadsInStorage = storage.table(
  "s3_multipart_uploads",
  {
    id: text("id").primaryKey().notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    in_progress_size: bigint("in_progress_size", { mode: "number" })
      .default(0)
      .notNull(),
    upload_signature: text("upload_signature").notNull(),
    bucket_id: text("bucket_id")
      .notNull()
      .references(() => bucketsInStorage.id),
    key: text("key").notNull(),
    version: text("version").notNull(),
    owner_id: text("owner_id"),
    created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      idx_multipart_uploads_list: index("idx_multipart_uploads_list").on(
        table.bucket_id,
        table.key,
        table.created_at,
      ),
    };
  },
);

export const s3_multipart_uploads_partsInStorage = storage.table(
  "s3_multipart_uploads_parts",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    upload_id: text("upload_id")
      .notNull()
      .references(() => s3_multipart_uploadsInStorage.id, {
        onDelete: "cascade",
      }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    size: bigint("size", { mode: "number" }).default(0).notNull(),
    part_number: integer("part_number").notNull(),
    bucket_id: text("bucket_id")
      .notNull()
      .references(() => bucketsInStorage.id),
    key: text("key").notNull(),
    etag: text("etag").notNull(),
    owner_id: text("owner_id"),
    version: text("version").notNull(),
    created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
);
