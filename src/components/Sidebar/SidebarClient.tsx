"use client";
import { useEffect, useMemo } from "react";
import { useStore } from "@/store/useStore";
import Link from "next/link";
import Button from "@/components/Button";
import { Thread } from "@/types";
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
    <aside className="w-64 border-r border-gray-200 h-full overflow-y-auto bg-white">
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
                className={`flex items-center ${
                  isActive ? "bg-gray-200" : "hover:bg-gray-50"
                } p-3 rounded-lg`}
              >
                <Link
                  href={`/t/${t.id}`}
                  className={`block p-3 rounded-lg transition-colors ${
                    isActive && "font-semibold"
                  }`}
                >
                  <p className="text-sm truncate">{getThreadLabel(t.id, 25)}</p>
                </Link>

                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    console.log("deleteThread", t.id);
                    await deleteThread(t.id);
                  }}
                  className="text-black  transition"
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
