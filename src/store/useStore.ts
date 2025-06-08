import { getRootThreads, getThreadBundle } from "@/lib/db/browser";
import { Anchor, Message, Thread, ThreadBundle } from "@/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface AppState {
  threads: Record<string, Thread>;
  messages: Record<string, Message[]>;
  anchors: Record<string, Anchor[]>;
  activeThreadId: string | null;
  openAnchorIds: Record<string, boolean>;

  hydrateBundle(bundle: ThreadBundle): void;
  hydrateRootThreads(threads: Thread[]): void;
  syncRootThreads(threads: Thread[]): Promise<void>;
  loadThread(id: string): Promise<void>;
}

export const useStore = create<AppState>()(
  immer((set, get) => ({
    threads: {},
    messages: {},
    anchors: {},
    activeThreadId: null,
    openAnchorIds: {},

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

    async syncRootThreads() {
      const data = await getRootThreads();
      get().hydrateRootThreads(data);
    },

    async loadThread(id) {
      const bundle = await getThreadBundle(id);
      get().hydrateBundle(bundle);
    },
  }))
);
