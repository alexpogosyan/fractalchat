import type { ThreadTreeNode } from "@fractalchat/types";

/**
 * Recursively finds a thread in the thread tree by ID
 */
function findThreadInTree(
  threadTree: ThreadTreeNode[],
  threadId: string | null
): ThreadTreeNode | null {
  if (!threadId) return null;

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
 * Builds breadcrumb path from root thread to current thread
 */
export function getBreadcrumbPath(
  threadTree: ThreadTreeNode[],
  threadId: string | null | undefined
): ThreadTreeNode[] {
  if (!threadId) return [];

  const thread = findThreadInTree(threadTree, threadId);
  if (!thread) return [];

  // Build path from root to current by traversing up parent chain
  const path: ThreadTreeNode[] = [];
  let current: ThreadTreeNode | null = thread;

  // Build path by going up the parent chain
  while (current) {
    path.unshift(current);

    // Find parent thread
    if (current.parent_id) {
      current = findThreadInTree(threadTree, current.parent_id);
    } else {
      current = null; // Reached root
    }
  }

  return path;
}

/**
 * Gets display title for a thread with fallback
 */
export function getThreadTitle(thread: ThreadTreeNode): string {
  return thread.title || "New Thread";
}
