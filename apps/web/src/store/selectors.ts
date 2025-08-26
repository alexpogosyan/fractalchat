import type { Thread } from "@fractalchat/types";
import { useStore } from "./useStore";
import { useShallow } from "zustand/shallow";

export const useRootThreads = () =>
  useStore(
    (s) => Object.values(s.threads).filter((t) => !t.parent_id) as Thread[]
  );

export const useMessages = (threadId: string | null) =>
  useStore((s) => (threadId ? s.messages[threadId] ?? [] : []));

export const useAnchorsForMessage = (threadId: string, msgId: string) =>
  useStore(
    useShallow((s) =>
      (s.anchors[threadId] ?? []).filter((a) => a.message_id === msgId)
    )
  );

export const useOpenAnchor = (anchorId: string) =>
  useStore((s) => !!s.openAnchorIds[anchorId]);
