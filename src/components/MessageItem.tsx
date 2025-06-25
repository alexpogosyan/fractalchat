import { useAnchorsForMessage } from "@/store/selectors";
import type { Message } from "@/types/app";
import { useRef } from "react";
import { useTextSelection } from "@/lib/hooks/useSelection";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { BranchButton } from "./BranchButton";
import { rangeToSelector } from "@/lib/anchors";
import MessageBody from "./MessageBody";

export default function MessageItem({
  msg,
  threadId,
  pathIds,
}: {
  msg: Message;
  threadId: string;
  pathIds: string[];
}) {
  const anchors = useAnchorsForMessage(threadId, msg.id);

  const isUser = msg.sender === "user";

  const bodyRef = useRef<HTMLDivElement>(null);
  const sel = useTextSelection(bodyRef);
  const router = useRouter();
  const branch = useStore((s) => s.branchFromSelection);

  const handleBranch = async () => {
    if (!sel?.range) return;

    const selector = rangeToSelector(bodyRef.current!, sel.range);
    if (!selector.exact.trim()) return;
    const childId = await branch(threadId, msg.id, selector);
    router.push(`/t/${[...pathIds, childId].join("/")}`);
  };

  const bubbleClasses = isUser
    ? "bg-gray-200 text-gray-800 rounded-xl px-3 py-2 max-w-[60%]"
    : "";

  return (
    <li className={isUser ? "flex justify-end mb-8" : "text-gray-800 mb-8"}>
      <div className={bubbleClasses}>
        <MessageBody
          ref={bodyRef}
          content={msg.content ?? ""}
          anchors={anchors}
          pathIds={pathIds}
        />
      </div>
      {sel && sel.range && (
        <BranchButton
          rect={sel.range.getBoundingClientRect()}
          onClick={handleBranch}
        />
      )}
    </li>
  );
}
