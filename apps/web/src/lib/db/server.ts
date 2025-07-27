import { getServerClient } from "@/lib/supabase/server";
import { coreGetRootThreads, coreGetThreadBundle } from "@/lib/db/core";

export async function getRootThreads() {
  const supabase = await getServerClient();
  return coreGetRootThreads(supabase);
}

export async function getThreadBundle(id: string) {
  const supabase = await getServerClient();
  return coreGetThreadBundle(supabase, id);
}
