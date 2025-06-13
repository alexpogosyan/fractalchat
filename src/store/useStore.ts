import { getRootThreads, getThreadBundle } from "@/lib/db/browser";
import { Anchor, Message, Thread, ThreadBundle } from "@/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  createThread as dbCreateThread,
  insertMessage as dbInsertMessage,
  insertAnchor as dbInsertAnchor,
  deleteThread as dbDeleteThread,
} from "@/lib/db/browser";
import { buildContext } from "@/lib/llm/context";

const LLM_HISTORY_LENGTH = 10;

export interface AppState {
  threads: Record<string, Thread>;
  messages: Record<string, Message[]>;
  anchors: Record<string, Anchor[]>;

  activeThreadId: string | null;
  openAnchorIds: Record<string, boolean>;
  pendingResponses: Record<string, boolean>;

  hydrateBundle(bundle: ThreadBundle): void;
  hydrateRootThreads(threads: Thread[]): void;
  syncRootThreads(threads: Thread[]): Promise<void>;
  loadThread(id: string): Promise<void>;
  toggleAnchor(anchorId: string): void;
  createThread(parentId: string | null): Promise<string>;
  sendMessage(threadId: string, prompt: string): Promise<void>;
  getThreadLabel(threadId: string, maxLength?: number): string;
  branchFromSelection: (
    parentThreadId: string,
    messageId: string,
    startIndex: number,
    endIndex: number
  ) => Promise<string>;
  deleteThread: (threadId: string) => Promise<void>;
}

export const useStore = create<AppState>()(
  immer((set, get) => ({
    threads: {},
    messages: {},
    anchors: {},
    activeThreadId: null,
    openAnchorIds: {},
    pendingResponses: {},

    hydrateBundle(bundle) {
      const { thread, messages, anchors } = bundle;

      set((s) => {
        s.threads[thread.id] = thread;
        s.messages[thread.id] = messages;
        s.anchors[thread.id] = anchors;
        s.activeThreadId = thread.id;
      });
    },

    hydrateRootThreads(list) {
      set((s) => {
        list.forEach((t) => {
          s.threads[t.id] = t;
        });
      });
    },

    toggleAnchor(id) {
      set((s) => ({
        openAnchorIds: { ...s.openAnchorIds, [id]: !s.openAnchorIds[id] },
      }));
    },

    async syncRootThreads() {
      const data = await getRootThreads();
      get().hydrateRootThreads(data);
    },

    async loadThread(id) {
      const bundle = await getThreadBundle(id);
      get().hydrateBundle(bundle);
    },

    async createThread(parentId: string | null) {
      const thread = await dbCreateThread(parentId, null);
      set((s) => {
        s.threads[thread.id] = thread;
        s.messages[thread.id] = [];
        s.activeThreadId = thread.id;
      });
      return thread.id;
    },

    getThreadLabel(threadId, maxLength = 20) {
      const state = get();
      const thread = state.threads[threadId];
      if (!thread) return "…";

      if (thread.title) {
        return thread.title.length <= maxLength
          ? thread.title
          : thread.title.slice(0, maxLength - 1) + "…";
      }

      const firstMsg = state.messages[threadId]?.[0]?.content ?? "";
      if (!firstMsg) return "Untitled";

      return firstMsg.length <= maxLength
        ? firstMsg
        : firstMsg.slice(0, maxLength - 1) + "…";
    },

    async sendMessage(threadId, prompt) {
      const userMsg = await dbInsertMessage(threadId, "user", prompt);
      set((s) => {
        (s.messages[threadId] ??= []).push(userMsg);
        s.pendingResponses[threadId] = true;
      });

      const history = buildContext(threadId, LLM_HISTORY_LENGTH);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, history }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const { content: aiContent } = await response.json();
      const aiMsg = await dbInsertMessage(threadId, "assistant", aiContent);
      set((s) => {
        (s.messages[threadId] ??= []).push(aiMsg);
        s.pendingResponses[threadId] = false;
      });
    },

    async branchFromSelection(parentThreadId, messageId, start, end) {
      const state = get();
      const parentMsg = (state.messages[parentThreadId] ?? []).find(
        (m) => m.id === messageId
      );
      const rawExcerpt = parentMsg?.content?.slice(start, end).trim() ?? "";
      const title = rawExcerpt.slice(0, 20) || null;
      const child = await dbCreateThread(parentThreadId, title);
      const anchor = await dbInsertAnchor(messageId, child.id, start, end);

      set((s) => {
        s.threads[child.id] = child;
        s.messages[child.id] = [];
        s.anchors[parentThreadId] ??= [];
        s.anchors[parentThreadId].push(anchor);
        s.activeThreadId = child.id;
      });
      return child.id;
    },

    deleteThread: async (threadId: string) => {
      await dbDeleteThread(threadId);

      set((s) => {
        const { [threadId]: _removed, ...rest } = s.threads;
        s.threads = rest;

        delete s.messages[threadId];
        delete s.anchors[threadId];

        if (s.activeThreadId === threadId) s.activeThreadId = null;
      });
    },
  }))
);
