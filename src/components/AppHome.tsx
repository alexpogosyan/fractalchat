import { getRootThreads } from "@/lib/db";
import Link from "next/link";
import { Thread } from "@/types";

export default async function AppHome() {
  const threads = await getRootThreads();

  return (
    <main className="min-h-screen bg-gray-50 px-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="divide-y divide-gray-200">
            {threads.map((thread) => (
              <ThreadItem key={thread.id} thread={thread} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function ThreadItem({ thread }: { thread: Thread }) {
  const formattedDate = new Date(thread.created_at).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <Link
      href={`/thread/${thread.id}`}
      className="block p-6 hover:bg-gray-50 transition-colors"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-lg font-medium text-gray-900 mb-2">
            {thread.title || "Untitled Thread"}
          </p>
          <p className="text-sm text-gray-500">Created {formattedDate}</p>
        </div>
        <div className="flex items-center text-gray-400">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
