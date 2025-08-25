import {
  createThread as dbCreateThread,
  deleteThread as dbDeleteThread,
  insertAnchor as dbInsertAnchor,
  insertMessage as dbInsertMessage,
  updateMessage as dbUpdateMessage,
  updateThreadTitle as dbUpdateThreadTitle,
  getRootThreads,
  getThreadBundle,
} from "@/lib/db/browser";
import { buildContext } from "@/lib/llm/context";
import { Anchor, Message, Thread, ThreadBundle } from "@fractalchat/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

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
  getThreadLabel(threadId: string): string;
  branchFromSelection: (
    parentThreadId: string,
    messageId: string,
    selector: { exact: string; prefix?: string; suffix?: string }
  ) => Promise<string>;
  deleteThread: (threadId: string) => Promise<void>;
  prefetchDescendants: (rootId: string) => Promise<void>;
  prefetchAncestors: (threadId: string) => Promise<void>;
  setActiveThreadId: (id: string | null) => void;
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

    getThreadLabel(threadId) {
      const state = get();
      const thread = state.threads[threadId];
      if (!thread) return "…";

      if (thread.title) {
        return thread.title;
      }

      const firstMsg = state.messages[threadId]?.[0]?.content ?? "";
      return firstMsg || "Untitled";
    },

    async sendMessage(threadId, prompt) {
      const userMsg = await dbInsertMessage(threadId, "user", prompt);
      set((s) => {
        (s.messages[threadId] ??= []).push(userMsg);
        s.pendingResponses[threadId] = true;
      });

      const curThread = get().threads[threadId];
      if (!curThread.title) {
        const title = prompt.trim().slice(0, 50);
        await dbUpdateThreadTitle(threadId, title);
        set((s) => {
          s.threads[threadId].title = title;
        });
      }

      const history = buildContext(threadId, LLM_HISTORY_LENGTH);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, history }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to get AI response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";
      let gotFirstChunk = false;

      const aiMsg = await dbInsertMessage(threadId, "assistant", "");
      set((s) => {
        (s.messages[threadId] ??= []).push({ ...aiMsg });
      });

      // Ensure we always persist whatever portion of the AI response we have, even
      // if the streaming request errors or is aborted when the user navigates
      // away.  We wrap the reading loop in try/catch/finally so the DB update and
      // pending state clearing are guaranteed to run.
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);

          if (!gotFirstChunk && chunk.trim()) {
            gotFirstChunk = true;
            set((s) => {
              s.pendingResponses[threadId] = false;
            });
          }

          fullResponse += chunk;

          set((s) => {
            const msgs = s.messages[threadId];
            if (msgs && msgs.length > 0) {
              const lastMsg = msgs[msgs.length - 1];
              if (lastMsg.sender === "assistant") {
                lastMsg.content = fullResponse;
              }
            }
          });
        }
      } catch (err) {
        console.error("Stream error while reading AI response:", err);
      } finally {
        // Persist whatever content we have (may be empty if the stream failed
        // early). Wrap in its own try/catch so one failure doesn't mask the
        // other.
        try {
          await dbUpdateMessage(aiMsg.id, fullResponse);
        } catch (persistErr) {
          console.error("Failed to persist assistant message:", persistErr);
        }

        // Ensure UI no longer shows the loader for this thread.
        set((s) => {
          s.pendingResponses[threadId] = false;
        });
      }
    },

    async branchFromSelection(parentThreadId, messageId, selector) {
      const rawExcerpt = selector.exact.trim();
      const title = rawExcerpt.slice(0, 20) || null;
      const child = await dbCreateThread(parentThreadId, title);
      const anchor = await dbInsertAnchor(messageId, child.id, selector);

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
        s.threads = Object.fromEntries(
          Object.entries(s.threads).filter(([id]) => id !== threadId)
        );

        delete s.messages[threadId];
        delete s.anchors[threadId];

        if (s.activeThreadId === threadId) s.activeThreadId = null;
      });
    },

    prefetchDescendants: async (rootId: string) => {
      const visited = new Set<string>();

      const dfs = async (id: string) => {
        if (visited.has(id)) return;
        visited.add(id);

        if (!get().anchors[id]) {
          const bundle = await getThreadBundle(id);
          set((s) => {
            s.threads[id] = bundle.thread;
            s.messages[id] = bundle.messages;
            s.anchors[id] = bundle.anchors;
          });
        }

        const childAnchors = get().anchors[id] ?? [];
        for (const a of childAnchors) {
          await dfs(a.thread_id);
        }
      };

      await dfs(rootId);
    },

    prefetchAncestors: async (threadId: string) => {
      const visited = new Set<string>();

      let curId: string | null = threadId;
      while (curId) {
        const curThread: Thread | undefined = get().threads[curId];
        if (!curThread) {
          // Need to fetch bundle for curId to get parent relation
          const bundle = await getThreadBundle(curId);
          const id = curId; // non-null id snapshot
          set((s) => {
            s.threads[id] = bundle.thread;
            s.messages[id] = bundle.messages;
            s.anchors[id] = bundle.anchors;
          });
          visited.add(curId);
          curId = bundle.thread.parent_id;
        } else {
          if (visited.has(curId)) break;
          visited.add(curId);
          curId = curThread.parent_id;
        }
      }
    },

    setActiveThreadId: (id) => {
      set((s) => {
        s.activeThreadId = id;
      });
    },
  }))
);
