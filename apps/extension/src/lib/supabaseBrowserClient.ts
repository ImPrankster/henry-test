/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.PLASMO_PUBLIC_SUPABASE_URL!,
  process.env.PLASMO_PUBLIC_SUPABASE_KEY!,
);
