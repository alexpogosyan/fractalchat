"use client";
import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import type { Message, ThreadBundle } from "@/types";
import MessageItem from "./MessageItem";
import { usePathname } from "next/navigation";
import Breadcrumbs from "./Breadcrumbs";
import Composer from "./Composer";

export default function Thread({ bundle }: { bundle: ThreadBundle }) {
  const hydrate = useStore((s) => s.hydrateBundle);
  const sendMessage = useStore((s) => s.sendMessage);

  const EMPTY: Message[] = [];

  const liveMessages = useStore((s) => s.messages[bundle.thread.id] ?? EMPTY);

  const pathname = usePathname();
  const pathIds = pathname.split("/").slice(2);

  const handleSend = async (prompt: string) => {
    await sendMessage(bundle.thread.id, prompt);
  };

  useEffect(() => {
    hydrate(bundle);
  }, [bundle, hydrate]);

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <Breadcrumbs />
        <ul className="p-4 space-y-3 mx-auto">
          {liveMessages.map((m) => (
            <MessageItem
              key={m.id}
              msg={m}
              threadId={bundle.thread.id}
              pathIds={pathIds}
            />
          ))}
        </ul>
      </div>
      <div>
        <Composer onSend={handleSend} />
      </div>
    </div>
  );
}
