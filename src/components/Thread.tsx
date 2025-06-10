"use client";
import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import type { ThreadBundle } from "@/types";
import MessageItem from "./MessageItem";
import { usePathname } from "next/navigation";
import Breadcrumbs from "./Breadcrumbs";

export default function Thread({ bundle }: { bundle: ThreadBundle }) {
  const hydrate = useStore((s) => s.hydrateBundle);
  const pathname = usePathname();
  const pathIds = pathname.split("/").slice(2);

  useEffect(() => {
    hydrate(bundle);
  }, [bundle, hydrate]);

  return (
    <>
      <Breadcrumbs />
      <ul className="p-4 space-y-3  mx-auto">
        {bundle.messages.map((m) => (
          <MessageItem
            key={m.id}
            msg={m}
            threadId={bundle.thread.id}
            pathIds={pathIds}
          />
        ))}
      </ul>
    </>
  );
}
