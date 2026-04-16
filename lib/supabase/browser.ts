import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabasePublicConfig } from "@/lib/config/env";

export function createSupabaseBrowserClient() {
  const { url, anonKey } = getSupabasePublicConfig();

  return createClient<Database>(url, anonKey);
}
