import { getBrowserClient } from "@/lib/supabase/browser";
import { coreGetRootThreads, coreGetThreadBundle } from "@/lib/db/core";

const supabase = getBrowserClient();

export const getRootThreads = () => coreGetRootThreads(supabase);
export const getThreadBundle = (id: string) =>
  coreGetThreadBundle(supabase, id);
