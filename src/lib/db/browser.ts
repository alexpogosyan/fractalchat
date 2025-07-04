import { getBrowserClient } from "@/lib/supabase/browser";
import {
  coreGetRootThreads,
  coreGetThreadBundle,
  coreCreateThread,
  coreInsertMessage,
  coreInsertAnchor,
  coreUpdateMessage,
} from "@/lib/db/core";

const supabase = getBrowserClient();

export const getRootThreads = () => coreGetRootThreads(supabase);

export const getThreadBundle = (id: string) =>
  coreGetThreadBundle(supabase, id);

export const createThread = (parentId: string | null, title: string | null) =>
  coreCreateThread(supabase, parentId, title);

export const insertMessage = (
  threadId: string,
  sender: "user" | "assistant",
  content: string
) => coreInsertMessage(supabase, threadId, sender, content);

export const updateMessage = (messageId: string, content: string) =>
  coreUpdateMessage(supabase, messageId, content);

export const insertAnchor = (
  messageId: string,
  threadId: string,
  selector: { exact: string; prefix?: string; suffix?: string }
) => coreInsertAnchor(supabase, messageId, threadId, selector);

export const deleteThread = (threadId: string) =>
  supabase.from("threads").delete().eq("id", threadId);

export const updateThreadTitle = (threadId: string, title: string) =>
  supabase.from("threads").update({ title }).eq("id", threadId);
