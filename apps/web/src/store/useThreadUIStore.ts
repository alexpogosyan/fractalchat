import { create } from "zustand";
import type { ThreadTreeNode } from "@fractalchat/types";

interface ThreadUIState {
  expandedThreads: Set<string>;
  toggleExpanded: (threadId: string) => void;
  setExpanded: (threadId: string, expanded: boolean) => void;
  isExpanded: (threadId: string) => boolean;
  expandAncestorPath: (threadTree: ThreadTreeNode[], threadId: string) => void;
  clearExpanded: () => void;
}

/**
 * Recursively finds a thread in the thread tree by ID
 */
function findThreadInTree(
  threadTree: ThreadTreeNode[],
  threadId: string
): ThreadTreeNode | null {
  for (const thread of threadTree) {
    if (thread.id === threadId) {
      return thread;
    }
    
    // Recursively search in children
    const found = findThreadInTree(thread.children, threadId);
    if (found) return found;
  }

  return null;
}

/**
 * Gets all ancestor thread IDs from root to current thread
 */
function getAncestorPath(
  threadTree: ThreadTreeNode[],
  threadId: string
): string[] {
  const thread = findThreadInTree(threadTree, threadId);
  if (!thread) return [];

  const ancestorIds: string[] = [];
  let current: ThreadTreeNode | null = thread;

  // Build path from current to root, then reverse to get root to current
  while (current) {
    if (current.parent_id) {
      ancestorIds.unshift(current.parent_id);
      current = findThreadInTree(threadTree, current.parent_id);
    } else {
      current = null; // Reached root
    }
  }

  return ancestorIds;
}

export const useThreadUIStore = create<ThreadUIState>((set, get) => ({
  expandedThreads: new Set<string>(),

  toggleExpanded: (threadId: string) => {
    set((state) => {
      const newExpanded = new Set(state.expandedThreads);
      if (newExpanded.has(threadId)) {
        newExpanded.delete(threadId);
      } else {
        newExpanded.add(threadId);
      }
      return { expandedThreads: newExpanded };
    });
  },

  setExpanded: (threadId: string, expanded: boolean) => {
    set((state) => {
      const newExpanded = new Set(state.expandedThreads);
      if (expanded) {
        newExpanded.add(threadId);
      } else {
        newExpanded.delete(threadId);
      }
      return { expandedThreads: newExpanded };
    });
  },

  isExpanded: (threadId: string) => {
    return get().expandedThreads.has(threadId);
  },

  expandAncestorPath: (threadTree: ThreadTreeNode[], threadId: string) => {
    const ancestorIds = getAncestorPath(threadTree, threadId);
    
    if (ancestorIds.length > 0) {
      set((state) => {
        const newExpanded = new Set(state.expandedThreads);
        // Add all ancestor IDs to expanded set
        ancestorIds.forEach(id => newExpanded.add(id));
        return { expandedThreads: newExpanded };
      });
    }
  },

  clearExpanded: () => {
    set({ expandedThreads: new Set<string>() });
  },
}));