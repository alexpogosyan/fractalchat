import { getServerClient } from "@/lib/supabase/server";
import { coreGetRootThreads, coreGetThreadBundle, coreGetThreadTree } from "@/lib/db/core";

export async function getRootThreads() {
  const supabase = await getServerClient();
  return coreGetRootThreads(supabase);
}

export async function getThreadBundle(id: string) {
  const supabase = await getServerClient();
  return coreGetThreadBundle(supabase, id);
}

export async function getThreadTree() {
  const supabase = await getServerClient();
  return coreGetThreadTree(supabase);
}
