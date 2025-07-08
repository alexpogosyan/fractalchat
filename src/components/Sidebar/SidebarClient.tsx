"use client";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/store/useStore";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Thread, Anchor } from "@/types/app";
import { useRouter, usePathname } from "next/navigation";
import { Trash, ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface SidebarClientProps {
  initial: Thread[];
}

export default function SidebarClient({ initial }: SidebarClientProps) {
  const router = useRouter();
  const hydrateRootThreads = useStore((s) => s.hydrateRootThreads);

  const threads = useStore((s) => s.threads);
  const getThreadLabel = useStore((s) => s.getThreadLabel);

  const createThread = useStore((s) => s.createThread);
  const activeThreadId = useStore((s) => s.activeThreadId);

  const deleteThread = useStore((s) => s.deleteThread);
  const prefetchDesc = useStore((s) => s.prefetchDescendants);

  const anchors = useStore((s) => s.anchors);

  const pathname = usePathname();
  const setActiveThreadId = useStore((s) => s.setActiveThreadId);

  const activeRootId = useMemo(() => {
    if (!activeThreadId) return null;
    let cur = threads[activeThreadId];
    while (cur?.parent_id) {
      cur = threads[cur.parent_id];
    }
    return cur?.id ?? null;
  }, [activeThreadId, threads]);

  const rootThreads = useMemo(() => {
    return Object.values(threads)
      .filter((t) => !t.parent_id)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [threads]);

  const handleNew = async () => {
    const id = await createThread(null);
    router.push(`/t/${id}`);
  };

  useEffect(() => {
    hydrateRootThreads(initial);
  }, [initial, hydrateRootThreads]);

  // Prefetch entire subtree under active root
  useEffect(() => {
    if (activeRootId) prefetchDesc(activeRootId);
  }, [activeRootId, prefetchDesc]);

  const [collapsed, setCollapsed] = useState(false);

  // Determine default collapsed based on screen width on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCollapsed(window.innerWidth < 768); // md breakpoint
    }
  }, []);

  // Clear activeThreadId when not on /t route
  useEffect(() => {
    if (!pathname.startsWith("/t/")) {
      setActiveThreadId(null);
    }
  }, [pathname, setActiveThreadId]);

  interface TreeNode {
    id: string;
    preview?: string; // first 20 chars from anchor exact, used before thread loads
    children: TreeNode[];
  }

  const buildTree = (parentId: string): TreeNode => {
    const childAnchors: Anchor[] = (() => {
      const list = anchors[parentId] ?? [];
      const parentMsgs = threads[parentId]
        ? useStore.getState().messages[parentId] ?? []
        : [];

      const positionFor = (a: Anchor) => {
        const msg = parentMsgs.find((m) => m.id === a.message_id);
        if (!msg?.content) return 1e9;
        const idx = msg.content.indexOf(a.selector.exact.trim());
        return idx === -1 ? 1e9 : idx;
      };

      return [...list].sort((a, b) => positionFor(a) - positionFor(b));
    })();
    return {
      id: parentId,
      children: childAnchors.map((a) => ({
        id: a.thread_id,
        preview: a.selector.exact.trim().slice(0, 20),
        children: buildTree(a.thread_id).children,
      })),
    };
  };

  const ThreadNode = ({
    node,
    depth,
    path,
  }: {
    node: TreeNode;
    depth: number;
    path: string[];
  }) => {
    if (depth === 0) {
      // root rendered separately, skip
      return (
        <>
          {node.children.map((c) => (
            <ThreadNode
              key={c.id}
              node={c}
              depth={depth + 1}
              path={[...path, c.id]}
            />
          ))}
        </>
      );
    }

    let label: string;
    if (threads[node.id]) {
      label = getThreadLabel(node.id);
    } else {
      label = node.preview || "…";
    }
    const isActive = activeThreadId === node.id;

    return (
      <div className="ml-2">
        <Link
          href={`/t/${path.join("/")}`}
          className={`block truncate text-sm py-1 ${
            isActive
              ? "font-semibold text-gray-800"
              : "text-gray-600 hover:text-gray-800"
          }`}
          style={{ paddingLeft: depth * 12 }}
        >
          {label}
        </Link>
        {node.children.map((c) => (
          <ThreadNode
            key={c.id}
            node={c}
            depth={depth + 1}
            path={[...path, c.id]}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <aside
        className={`bg-gray-50 border-r border-gray-200 overflow-y-auto transition-all duration-300
          ${collapsed ? "w-12 flex-none" : "w-64"}
          ${collapsed ? "static" : "absolute md:static"}
          ${collapsed ? "" : "top-12 left-0 h-[calc(100vh-56px)] z-20"}`}
      >
        {/* Narrow strip always visible when collapsed */}
        {collapsed ? (
          <div className="flex flex-col items-center mt-2 space-y-4">
            <button
              onClick={() => setCollapsed(false)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleNew}
              className="p-1 rounded hover:bg-gray-100"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="p-2 pl-4 relative">
            <button
              onClick={() => setCollapsed(true)}
              className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex justify-between mb-4">
              <Button size="sm" onClick={handleNew}>
                New
              </Button>
            </div>
            {rootThreads.length === 0 ? (
              <p className="py-4 text-sm text-gray-500">No threads yet</p>
            ) : (
              rootThreads.map((t) => {
                const isActive = t.id === activeRootId;
                return (
                  <div
                    key={t.id}
                    className={`group flex flex-col gap-1 rounded-md px-3 py-2 ${
                      isActive ? "bg-gray-200" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/t/${t.id}`}
                        className="flex-1 min-w-0 truncate transition-colors"
                      >
                        <span
                          className={`text-sm truncate ${
                            isActive ? "font-semibold" : ""
                          }`}
                        >
                          {getThreadLabel(t.id)}
                        </span>
                      </Link>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          await deleteThread(t.id);
                        }}
                        className="cursor-pointer opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-600 transition-opacity p-1 rounded"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                    {isActive && anchors[t.id] && anchors[t.id].length > 0 && (
                      <ThreadNode
                        node={buildTree(t.id)}
                        depth={0}
                        path={[t.id]}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </aside>
    </>
  );
}
