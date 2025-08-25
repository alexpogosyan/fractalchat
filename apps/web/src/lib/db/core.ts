import type { SupabaseClient } from "@supabase/supabase-js";
import type { Anchor, Message, Thread, ThreadBundle, ThreadTreeNode } from "@/types/app";

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

export async function coreUpdateMessage(
  supabase: SupabaseClient,
  messageId: string,
  content: string
) {
  const { error } = await supabase
    .from("messages")
    .update({ content })
    .eq("id", messageId);

  if (error) throw error;
}

export async function coreInsertAnchor(
  supabase: SupabaseClient,
  messageId: string,
  threadId: string,
  selector: { exact: string; prefix?: string; suffix?: string }
) {
  const { data, error } = await supabase
    .from("anchors")
    .insert({
      message_id: messageId,
      thread_id: threadId,
      selector,
    })
    .select()
    .single<Anchor>();

  if (error) throw error;
  return data;
}

export async function coreGetThreadTree(
  supabase: SupabaseClient
): Promise<ThreadTreeNode[]> {
  // Get all threads
  const { data: threads, error } = await supabase
    .from("threads")
    .select(`
      id,
      user_id,
      parent_id,
      title,
      created_at,
      messages (id)
    `)
    .order("created_at");

  if (error) throw error;
  if (!threads) return [];

  // Build thread tree structure
  const threadMap = new Map<string, ThreadTreeNode>();
  const rootThreads: ThreadTreeNode[] = [];

  // First pass: create all thread nodes
  threads.forEach((thread) => {
    const threadNode: ThreadTreeNode = {
      id: thread.id,
      user_id: thread.user_id,
      parent_id: thread.parent_id,
      title: thread.title,
      created_at: thread.created_at,
      children: [],
      messageCount: thread.messages?.length || 0,
      lastActivity: thread.created_at,
    };
    threadMap.set(thread.id, threadNode);
  });

  // Second pass: build tree hierarchy
  threadMap.forEach((thread) => {
    if (thread.parent_id) {
      const parent = threadMap.get(thread.parent_id);
      if (parent) {
        parent.children.push(thread);
        // Update parent's last activity if child is more recent
        if (thread.lastActivity && thread.lastActivity > (parent.lastActivity || '')) {
          parent.lastActivity = thread.lastActivity;
        }
      }
    } else {
      rootThreads.push(thread);
    }
  });

  // Sort children by creation date
  const sortChildren = (nodes: ThreadTreeNode[]) => {
    nodes.sort((a, b) => a.created_at.localeCompare(b.created_at));
    nodes.forEach((node) => sortChildren(node.children));
  };
  
  sortChildren(rootThreads);
  
  return rootThreads;
}
