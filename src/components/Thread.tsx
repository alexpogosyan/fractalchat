"use client";
import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";
import type { Message, ThreadBundle } from "@/types";
import MessageItem from "./MessageItem";
import { usePathname } from "next/navigation";
import Breadcrumbs from "./Breadcrumbs";
import Composer from "./Composer";

export default function Thread({ bundle }: { bundle: ThreadBundle }) {
  const hydrate = useStore((s) => s.hydrateBundle);
  const sendMessage = useStore((s) => s.sendMessage);
  const pending = useStore(
    (s) => s.pendingResponses[bundle.thread.id] ?? false
  );

  const EMPTY: Message[] = [];

  const liveMessages = useStore((s) => s.messages[bundle.thread.id] ?? EMPTY);

  const pathname = usePathname();
  const pathIds = pathname.split("/").slice(2);

  const handleSend = async (prompt: string) => {
    await sendMessage(bundle.thread.id, prompt);
  };

  const isEmpty = liveMessages.length === 0;

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    hydrate(bundle);
  }, [bundle, hydrate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [liveMessages.length]);

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

          {pending && (
            <li className="flex">
              <p className="bg-gray-100 text-gray-500 px-3 py-2 rounded-lg text-sm animate-ellipsis">
                Thinking...
              </p>
            </li>
          )}
        </ul>
        <div ref={bottomRef} />
      </div>
      <div>
        <Composer onSend={handleSend} autoFocus={isEmpty} />
      </div>
    </div>
  );
}
