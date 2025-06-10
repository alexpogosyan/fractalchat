import type { SupabaseClient } from "@supabase/supabase-js";
import type { Message, Thread, ThreadBundle } from "@/types";

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

export async function coreCreateThread(
  supabase: SupabaseClient,
  parentId: string | null,
  title: string | null
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("threads")
    .insert({ parent_id: parentId, title, user_id: user.id })
    .select()
    .single<Thread>();

  if (error) throw error;
  return data;
}

export async function coreInsertMessage(
  supabase: SupabaseClient,
  threadId: string,
  sender: "user" | "assistant",
  content: string
) {
  const { data, error } = await supabase
    .from("messages")
    .insert({ thread_id: threadId, sender, content })
    .select()
    .single<Message>();

  if (error) throw error;
  return data;
}
