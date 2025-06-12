import { useAnchorsForMessage } from "@/store/selectors";
import type { Message } from "@/types";
import AnchorSpan from "./AnchorSpan";
import { useRef } from "react";
import { useTextSelection } from "@/lib/hooks/useSelection";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { BranchButton } from "./BranchButton";

export default function MessageItem({
  msg,
  threadId,
  pathIds,
}: {
  msg: Message;
  threadId: string;
  pathIds: string[];
}) {
  const anchors = useAnchorsForMessage(threadId, msg.id).sort(
    (a, b) => a.start_index - b.start_index
  );

  const parts: React.ReactNode[] = [];
  let cursor = 0;

  anchors.forEach((a) => {
    if (a.start_index > cursor) {
      parts.push(msg.content!.slice(cursor, a.start_index));
    }

    const anchorText = msg.content!.slice(a.start_index, a.end_index);

    parts.push(
      <AnchorSpan
        key={a.id}
        anchor={a}
        text={anchorText}
        currentPath={pathIds}
      />
    );

    cursor = a.end_index;
  });

  if (cursor < msg.content!.length) {
    parts.push(msg.content!.slice(cursor));
  }

  const isUser = msg.sender === "user";

  const spanRef = useRef<HTMLParagraphElement>(null);
  const sel = useTextSelection(spanRef);
  const router = useRouter();
  const branch = useStore((s) => s.branchFromSelection);

  const handleBranch = async () => {
    if (!sel?.range) return;
    const start = sel.range.startOffset;
    const end = sel.range.endOffset;

    const newId = await branch(threadId, msg.id, start, end);
    router.push(`/t/${[...pathIds, newId].join("/")}`);
  };

  if (isUser) {
    return (
      <li className="flex justify-end">
        <div className="bg-gray-200 text-gray-800 rounded-xl px-3 py-2 max-w-[60%]">
          <p className="whitespace-pre-wrap align-right">{parts}</p>
        </div>
      </li>
    );
  }

  return (
    <li className="text-gray-800">
      <p ref={spanRef} className="whitespace-pre-wrap">
        {parts}
      </p>
      {sel && sel.range && (
        <BranchButton
          rect={sel.range.getBoundingClientRect()}
          onClick={handleBranch}
        />
      )}
    </li>
  );
}
