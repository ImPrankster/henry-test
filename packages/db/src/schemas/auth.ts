import { sql } from "drizzle-orm";
import {
  bigserial,
  boolean,
  index,
  inet,
  json,
  jsonb,
  pgSchema,
  smallint,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const auth = pgSchema("auth");

export const aal_levelInAuth = auth.enum("aal_level", ["aal1", "aal2", "aal3"]);
export const code_challenge_methodInAuth = auth.enum("code_challenge_method", [
  "s256",
  "plain",
]);
export const factor_statusInAuth = auth.enum("factor_status", [
  "unverified",
  "verified",
]);
export const factor_typeInAuth = auth.enum("factor_type", ["totp", "webauthn"]);
export const one_time_token_typeInAuth = auth.enum("one_time_token_type", [
  "confirmation_token",
  "reauthentication_token",
  "recovery_token",
  "email_change_token_new",
  "email_change_token_current",
  "phone_change_token",
]);

export const instancesInAuth = auth.table("instances", {
  id: uuid("id").primaryKey().notNull(),
  uuid: uuid("uuid"),
  raw_base_config: text("raw_base_config"),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" }),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" }),
});

export const schema_migrationsInAuth = auth.table("schema_migrations", {
  version: varchar("version", { length: 255 }).primaryKey().notNull(),
});

export const audit_log_entriesInAuth = auth.table(
  "audit_log_entries",
  {
    instance_id: uuid("instance_id"),
    id: uuid("id").primaryKey().notNull(),
    payload: json("payload"),
    created_at: timestamp("created_at", { withTimezone: true, mode: "string" }),
    ip_address: varchar("ip_address", { length: 64 })
      .default(sql`''::character varying`)
      .notNull(),
  },
  (table) => {
    return {
      audit_logs_instance_id_idx: index("audit_logs_instance_id_idx").on(
        table.instance_id,
      ),
    };
  },
);

export const identitiesInAuth = auth.table(
  "identities",
  {
    provider_id: text("provider_id").notNull(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => usersInAuth.id, { onDelete: "cascade" }),
    identity_data: jsonb("identity_data").notNull(),
    provider: text("provider").notNull(),
    last_sign_in_at: timestamp("last_sign_in_at", {
      withTimezone: true,
      mode: "string",
    }),
    created_at: timestamp("created_at", { withTimezone: true, mode: "string" }),
    updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" }),
    email: text("email"),
    id: uuid("id").defaultRandom().primaryKey().notNull(),
  },
  (table) => {
    return {
      user_id_idx: index("identities_user_id_idx").on(table.user_id),
      email_idx: index("identities_email_idx").on(table.email),
      identities_provider_id_provider_unique: unique(
        "identities_provider_id_provider_unique",
      ).on(table.provider_id, table.provider),
    };
  },
);

export const usersInAuth = auth.table(
  "users",
  {
    instance_id: uuid("instance_id"),
    id: uuid("id").primaryKey().notNull(),
    aud: varchar("aud", { length: 255 }),
    role: varchar("role", { length: 255 }),
    email: varchar("email", { length: 255 }),
    encrypted_password: varchar("encrypted_password", { length: 255 }),
    email_confirmed_at: timestamp("email_confirmed_at", {
      withTimezone: true,
      mode: "string",
    }),
    invited_at: timestamp("invited_at", { withTimezone: true, mode: "string" }),
    confirmation_token: varchar("confirmation_token", { length: 255 }),
    confirmation_sent_at: timestamp("confirmation_sent_at", {
      withTimezone: true,
      mode: "string",
    }),
    recovery_token: varchar("recovery_token", { length: 255 }),
    recovery_sent_at: timestamp("recovery_sent_at", {
      withTimezone: true,
      mode: "string",
    }),
    email_change_token_new: varchar("email_change_token_new", { length: 255 }),
    email_change: varchar("email_change", { length: 255 }),
    email_change_sent_at: timestamp("email_change_sent_at", {
      withTimezone: true,
      mode: "string",
    }),
    last_sign_in_at: timestamp("last_sign_in_at", {
      withTimezone: true,
      mode: "string",
    }),
    raw_app_meta_data: jsonb("raw_app_meta_data"),
    raw_user_meta_data: jsonb("raw_user_meta_data"),
    is_super_admin: boolean("is_super_admin"),
    created_at: timestamp("created_at", { withTimezone: true, mode: "string" }),
    updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" }),
    phone: text("phone").default(sql`NULL::character varying`),
    phone_confirmed_at: timestamp("phone_confirmed_at", {
      withTimezone: true,
      mode: "string",
    }),
    phone_change: text("phone_change").default(sql`''::character varying`),
    phone_change_token: varchar("phone_change_token", { length: 255 }).default(
      sql`''::character varying`,
    ),
    phone_change_sent_at: timestamp("phone_change_sent_at", {
      withTimezone: true,
      mode: "string",
    }),
    confirmed_at: timestamp("confirmed_at", {
      withTimezone: true,
      mode: "string",
    }),
    email_change_token_current: varchar("email_change_token_current", {
      length: 255,
    }).default(sql`''::character varying`),
    email_change_confirm_status: smallint(
      "email_change_confirm_status",
    ).default(0),
    banned_until: timestamp("banned_until", {
      withTimezone: true,
      mode: "string",
    }),
    reauthentication_token: varchar("reauthentication_token", {
      length: 255,
    }).default(sql`''::character varying`),
    reauthentication_sent_at: timestamp("reauthentication_sent_at", {
      withTimezone: true,
      mode: "string",
    }),
    is_sso_user: boolean("is_sso_user").default(false).notNull(),
    deleted_at: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
    is_anonymous: boolean("is_anonymous").default(false).notNull(),
  },
  (table) => {
    return {
      instance_id_idx: index("users_instance_id_idx").on(table.instance_id),
      instance_id_email_idx: index("users_instance_id_email_idx").on(
        table.instance_id,
      ),
      confirmation_token_idx: uniqueIndex("confirmation_token_idx").on(
        table.confirmation_token,
      ),
      recovery_token_idx: uniqueIndex("recovery_token_idx").on(
        table.recovery_token,
      ),
      email_change_token_current_idx: uniqueIndex(
        "email_change_token_current_idx",
      ).on(table.email_change_token_current),
      email_change_token_new_idx: uniqueIndex("email_change_token_new_idx").on(
        table.email_change_token_new,
      ),
      is_anonymous_idx: index("users_is_anonymous_idx").on(table.is_anonymous),
      reauthentication_token_idx: uniqueIndex("reauthentication_token_idx").on(
        table.reauthentication_token,
      ),
      email_partial_key: uniqueIndex("users_email_partial_key").on(table.email),
      users_phone_key: unique("users_phone_key").on(table.phone),
    };
  },
);

export const refresh_tokensInAuth = auth.table(
  "refresh_tokens",
  {
    instance_id: uuid("instance_id"),
    id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
    token: varchar("token", { length: 255 }),
    user_id: varchar("user_id", { length: 255 }),
    revoked: boolean("revoked"),
    created_at: timestamp("created_at", { withTimezone: true, mode: "string" }),
    updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" }),
    parent: varchar("parent", { length: 255 }),
    session_id: uuid("session_id").references(() => sessionsInAuth.id, {
      onDelete: "cascade",
    }),
  },
  (table) => {
    return {
      instance_id_idx: index("refresh_tokens_instance_id_idx").on(
        table.instance_id,
      ),
      instance_id_user_id_idx: index(
        "refresh_tokens_instance_id_user_id_idx",
      ).on(table.instance_id, table.user_id),
      parent_idx: index("refresh_tokens_parent_idx").on(table.parent),
      updated_at_idx: index("refresh_tokens_updated_at_idx").on(
        table.updated_at,
      ),
      session_id_revoked_idx: index("refresh_tokens_session_id_revoked_idx").on(
        table.revoked,
        table.session_id,
      ),
      refresh_tokens_token_unique: unique("refresh_tokens_token_unique").on(
        table.token,
      ),
    };
  },
);

export const mfa_factorsInAuth = auth.table(
  "mfa_factors",
  {
    id: uuid("id").primaryKey().notNull(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => usersInAuth.id, { onDelete: "cascade" }),
    friendly_name: text("friendly_name"),
    factor_type: factor_typeInAuth("factor_type").notNull(),
    status: factor_statusInAuth("status").notNull(),
    created_at: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updated_at: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    secret: text("secret"),
  },
  (table) => {
    return {
      user_id_idx: index("mfa_factors_user_id_idx").on(table.user_id),
      user_friendly_name_unique: uniqueIndex(
        "mfa_factors_user_friendly_name_unique",
      ).on(table.user_id, table.friendly_name),
      factor_id_created_at_idx: index("factor_id_created_at_idx").on(
        table.user_id,
        table.created_at,
      ),
    };
  },
);

export const mfa_challengesInAuth = auth.table(
  "mfa_challenges",
  {
    id: uuid("id").primaryKey().notNull(),
    factor_id: uuid("factor_id")
      .notNull()
      .references(() => mfa_factorsInAuth.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    verified_at: timestamp("verified_at", {
      withTimezone: true,
      mode: "string",
    }),
    ip_address: inet("ip_address").notNull(),
  },
  (table) => {
    return {
      mfa_challenge_created_at_idx: index("mfa_challenge_created_at_idx").on(
        table.created_at,
      ),
    };
  },
);

export const sessionsInAuth = auth.table(
  "sessions",
  {
    id: uuid("id").primaryKey().notNull(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => usersInAuth.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at", { withTimezone: true, mode: "string" }),
    updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" }),
    factor_id: uuid("factor_id"),
    aal: aal_levelInAuth("aal"),
    not_after: timestamp("not_after", { withTimezone: true, mode: "string" }),
    refreshed_at: timestamp("refreshed_at", { mode: "string" }),
    user_agent: text("user_agent"),
    ip: inet("ip"),
    tag: text("tag"),
  },
  (table) => {
    return {
      not_after_idx: index("sessions_not_after_idx").on(table.not_after),
      user_id_created_at_idx: index("user_id_created_at_idx").on(
        table.user_id,
        table.created_at,
      ),
      user_id_idx: index("sessions_user_id_idx").on(table.user_id),
    };
  },
);

export const mfa_amr_claimsInAuth = auth.table(
  "mfa_amr_claims",
  {
    session_id: uuid("session_id")
      .notNull()
      .references(() => sessionsInAuth.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updated_at: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    authentication_method: text("authentication_method").notNull(),
    id: uuid("id").primaryKey().notNull(),
  },
  (table) => {
    return {
      mfa_amr_claims_session_id_authentication_method_pkey: unique(
        "mfa_amr_claims_session_id_authentication_method_pkey",
      ).on(table.session_id, table.authentication_method),
    };
  },
);

export const sso_providersInAuth = auth.table("sso_providers", {
  id: uuid("id").primaryKey().notNull(),
  resource_id: text("resource_id"),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" }),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" }),
});

export const sso_domainsInAuth = auth.table(
  "sso_domains",
  {
    id: uuid("id").primaryKey().notNull(),
    sso_provider_id: uuid("sso_provider_id")
      .notNull()
      .references(() => sso_providersInAuth.id, { onDelete: "cascade" }),
    domain: text("domain").notNull(),
    created_at: timestamp("created_at", { withTimezone: true, mode: "string" }),
    updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" }),
  },
  (table) => {
    return {
      sso_provider_id_idx: index("sso_domains_sso_provider_id_idx").on(
        table.sso_provider_id,
      ),
    };
  },
);

export const saml_relay_statesInAuth = auth.table(
  "saml_relay_states",
  {
    id: uuid("id").primaryKey().notNull(),
    sso_provider_id: uuid("sso_provider_id")
      .notNull()
      .references(() => sso_providersInAuth.id, { onDelete: "cascade" }),
    request_id: text("request_id").notNull(),
    for_email: text("for_email"),
    redirect_to: text("redirect_to"),
    created_at: timestamp("created_at", { withTimezone: true, mode: "string" }),
    updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" }),
    flow_state_id: uuid("flow_state_id").references(() => flow_stateInAuth.id, {
      onDelete: "cascade",
    }),
  },
  (table) => {
    return {
      created_at_idx: index("saml_relay_states_created_at_idx").on(
        table.created_at,
      ),
      sso_provider_id_idx: index("saml_relay_states_sso_provider_id_idx").on(
        table.sso_provider_id,
      ),
      for_email_idx: index("saml_relay_states_for_email_idx").on(
        table.for_email,
      ),
    };
  },
);

export const flow_stateInAuth = auth.table(
  "flow_state",
  {
    id: uuid("id").primaryKey().notNull(),
    user_id: uuid("user_id"),
    auth_code: text("auth_code").notNull(),
    code_challenge_method: code_challenge_methodInAuth(
      "code_challenge_method",
    ).notNull(),
    code_challenge: text("code_challenge").notNull(),
    provider_type: text("provider_type").notNull(),
    provider_access_token: text("provider_access_token"),
    provider_refresh_token: text("provider_refresh_token"),
    created_at: timestamp("created_at", { withTimezone: true, mode: "string" }),
    updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" }),
    authentication_method: text("authentication_method").notNull(),
    auth_code_issued_at: timestamp("auth_code_issued_at", {
      withTimezone: true,
      mode: "string",
    }),
  },
  (table) => {
    return {
      idx_auth_code: index("idx_auth_code").on(table.auth_code),
      idx_user_id_auth_method: index("idx_user_id_auth_method").on(
        table.user_id,
        table.authentication_method,
      ),
      created_at_idx: index("flow_state_created_at_idx").on(table.created_at),
    };
  },
);

export const saml_providersInAuth = auth.table(
  "saml_providers",
  {
    id: uuid("id").primaryKey().notNull(),
    sso_provider_id: uuid("sso_provider_id")
      .notNull()
      .references(() => sso_providersInAuth.id, { onDelete: "cascade" }),
    entity_id: text("entity_id").notNull(),
    metadata_xml: text("metadata_xml").notNull(),
    metadata_url: text("metadata_url"),
    attribute_mapping: jsonb("attribute_mapping"),
    created_at: timestamp("created_at", { withTimezone: true, mode: "string" }),
    updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" }),
    name_id_format: text("name_id_format"),
  },
  (table) => {
    return {
      sso_provider_id_idx: index("saml_providers_sso_provider_id_idx").on(
        table.sso_provider_id,
      ),
      saml_providers_entity_id_key: unique("saml_providers_entity_id_key").on(
        table.entity_id,
      ),
    };
  },
);

export const one_time_tokensInAuth = auth.table(
  "one_time_tokens",
  {
    id: uuid("id").primaryKey().notNull(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => usersInAuth.id, { onDelete: "cascade" }),
    token_type: one_time_token_typeInAuth("token_type").notNull(),
    token_hash: text("token_hash").notNull(),
    relates_to: text("relates_to").notNull(),
    created_at: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      token_hash_hash_idx: index("one_time_tokens_token_hash_hash_idx").on(
        table.token_hash,
      ),
      relates_to_hash_idx: index("one_time_tokens_relates_to_hash_idx").on(
        table.relates_to,
      ),
      user_id_token_type_key: uniqueIndex(
        "one_time_tokens_user_id_token_type_key",
      ).on(table.user_id, table.token_type),
    };
  },
);
