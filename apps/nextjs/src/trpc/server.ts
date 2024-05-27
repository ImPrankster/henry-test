import { cache } from "react";
import { headers } from "next/headers";

import { createCaller, createTRPCContext } from "@henry/api";

import { createClient } from "~/server/supabase";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return createTRPCContext({
    user: user,
    headers: heads,
  });
});

export const api = createCaller(createContext);
