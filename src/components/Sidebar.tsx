import Link from "next/link";
import { getRootThreads } from "@/lib/db";
import { Thread } from "@/types";
import { Button } from "./Button";

export default async function Sidebar() {
  const threads = await getRootThreads();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Button size="sm">New</Button>
        </div>

        <div className="space-y-1">
          {threads.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">No threads yet</p>
          ) : (
            threads.map((thread) => (
              <ThreadSidebarItem key={thread.id} thread={thread} />
            ))
          )}
        </div>
      </div>
    </aside>
  );
}

function ThreadSidebarItem({ thread }: { thread: Thread }) {
  const formattedDate = new Date(thread.created_at).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  );

  return (
    <Link
      href={`/thread/${thread.id}`}
      className="block p-3 rounded-lg hover:bg-gray-50 transition-colors group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate group-hover:text-black">
            {thread.title || "Untitled Thread"}
          </p>
          <p className="text-xs text-gray-500 mt-1">{formattedDate}</p>
        </div>
      </div>
    </Link>
  );
}
