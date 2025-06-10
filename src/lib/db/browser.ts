import { getBrowserClient } from "@/lib/supabase/browser";
import {
  coreGetRootThreads,
  coreGetThreadBundle,
  coreCreateThread,
  coreInsertMessage,
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
