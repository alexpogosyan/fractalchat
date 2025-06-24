"use client";
import { useEffect, useMemo } from "react";
import { useStore } from "@/store/useStore";
import Link from "next/link";
import Button from "@/components/Button";
import { Thread } from "@/types/app";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";

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

  return (
    <aside className="w-64 border-r border-gray-200 h-full overflow-y-auto bg-gray-50">
      <div className="p-4">
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
                className={`group flex items-center gap-2 rounded-md px-3 py-2 ${
                  isActive ? "bg-gray-200" : "hover:bg-gray-50"
                }`}
              >
                <Link
                  href={`/t/${t.id}`}
                  className={`flex-1 min-w-0 truncate transition-colors `}
                >
                  <span className="text-sm truncate">
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
            );
          })
        )}
      </div>
    </aside>
  );
}
