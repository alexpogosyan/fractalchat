"use client";
import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import type { ThreadBundle } from "@/types";
import { useShallow } from "zustand/shallow";

export default function ThreadClient({ bundle }: { bundle: ThreadBundle }) {
  const hydrate = useStore((s) => s.hydrateBundle);
  const msgs = useStore(useShallow((s) => s.messages[bundle.thread.id] ?? []));

  useEffect(() => {
    hydrate(bundle);
  }, [bundle, hydrate]);

  return (
    <div className="flex flex-col h-full">
      <header className="border-b p-3">
        <h1 className="font-semibold text-lg">
          {bundle.thread.title || "Untitled Thread"}
        </h1>
      </header>

      <ul className="flex-1 overflow-y-auto space-y-3 p-4">
        {msgs.map((m) => (
          <li
            key={m.id}
            className={m.sender === "user" ? "text-red-700" : "text-gray-800"}
          >
            {m.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
