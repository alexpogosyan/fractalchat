import { getBrowserClient, getServerClient } from "@/lib/supabase";

export function getSupabaseClient() {
  return typeof window === "undefined" ? getServerClient() : getBrowserClient();
}

export async function getRootThreads() {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from("threads")
    .select("*")
    .is("parent_id", null)
    .order("created_at");
  if (error) throw error;
  return data;
}
