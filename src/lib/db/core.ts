import type { SupabaseClient } from "@supabase/supabase-js";
import type { Thread, ThreadBundle } from "@/types";

export async function coreGetRootThreads(
  supabase: SupabaseClient
): Promise<Thread[]> {
  const { data, error } = await supabase
    .from("threads")
    .select("*")
    .is("parent_id", null)
    .order("created_at");
  if (error) throw error;
  return data ?? [];
}

export async function coreGetThreadBundle(
  supabase: SupabaseClient,
  threadId: string
): Promise<ThreadBundle> {
  const { data: thread, error: threadError } = await supabase
    .from("threads")
    .select("*")
    .eq("id", threadId)
    .single<Thread>();

  if (threadError) throw threadError;

  const { data: messages, error: messageError } = await supabase
    .from("messages")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at");

  if (messageError) throw messageError;

  const messageIds = messages.map((m) => m.id);

  const { data: anchors, error: anchorError } = await supabase
    .from("anchors")
    .select("*")
    .in("message_id", messageIds);

  if (anchorError) throw anchorError;

  return { thread, messages, anchors };
}
