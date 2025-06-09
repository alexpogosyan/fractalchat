"use client";
import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import type { ThreadBundle } from "@/types";
import MessageItem from "./MessageItem";
import { usePathname } from "next/navigation";

export default function ThreadClient({ bundle }: { bundle: ThreadBundle }) {
  const hydrate = useStore((s) => s.hydrateBundle);
  const pathname = usePathname();
  const pathIds = pathname.split("/").slice(2);

  useEffect(() => {
    hydrate(bundle);
  }, [bundle, hydrate]);

  return (
    <ul className="space-y-3">
      {bundle.messages.map((m) => (
        <MessageItem
          key={m.id}
          msg={m}
          threadId={bundle.thread.id}
          pathIds={pathIds}
        />
      ))}
    </ul>
  );
}
