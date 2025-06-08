"use client";
import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import Link from "next/link";
import Button from "@/components/Button";
import { Thread } from "@/types";
import { useShallow } from "zustand/shallow";

interface SidebarClientProps {
  initial: Thread[];
}

export default function SidebarClient({ initial }: SidebarClientProps) {
  const hydrateRootThreads = useStore((s) => s.hydrateRootThreads);

  const threads = useStore(
    useShallow((s) => Object.values(s.threads).filter((t) => !t.parent_id))
  );

  useEffect(() => {
    hydrateRootThreads(initial);
  }, [initial, hydrateRootThreads]);

  return (
    <aside className="w-64 border-r border-gray-200 h-full overflow-y-auto bg-white">
      <div className="p-4">
        <div className="flex justify-between mb-4">
          <Button size="sm">New</Button>
        </div>
        {threads.length === 0 ? (
          <p className="py-4 text-sm text-gray-500">No threads yet</p>
        ) : (
          threads.map((t) => (
            <Link
              key={t.id}
              href={`/t/${t.id}`}
              className="block p-3 rounded-lg hover:bg-gray-50"
            >
              <p className="text-sm font-medium truncate">
                {t.title ?? "Untitled"}
              </p>
            </Link>
          ))
        )}
      </div>
    </aside>
  );
}
