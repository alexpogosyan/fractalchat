import { getBrowserClient } from "@/lib/supabase/browser";
import {
  coreGetRootThreads,
  coreGetThreadBundle,
  coreCreateThread,
  coreInsertMessage,
  coreInsertAnchor,
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

export const insertAnchor = (
  messageId: string,
  threadId: string,
  startIndex: number,
  endIndex: number
) => coreInsertAnchor(supabase, messageId, threadId, startIndex, endIndex);

export const deleteThread = (threadId: string) =>
  supabase.from("threads").delete().eq("id", threadId);
