import { useAnchorsForMessage } from "@/store/selectors";
import type { Message, Anchor } from "@/types/app";
import AnchorSpan from "./AnchorSpan";
import { useMemo, useRef } from "react";
import { useTextSelection } from "@/lib/hooks/useSelection";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { BranchButton } from "./BranchButton";
import { rangeToSelector } from "@/lib/anchors";

export default function MessageItem({
  msg,
  threadId,
  pathIds,
}: {
  msg: Message;
  threadId: string;
  pathIds: string[];
}) {
  const rawAnchors = useAnchorsForMessage(threadId, msg.id);
  const anchors = useMemo(() => {
    if (!msg.content) return rawAnchors;
    const getIndex = (a: Anchor) => msg.content!.indexOf(a.selector.exact);
    return [...rawAnchors].sort((a, b) => getIndex(a) - getIndex(b));
  }, [rawAnchors, msg.content]);

  const parts: React.ReactNode[] = [];
  let cursor = 0;

  anchors.forEach((a) => {
    const idx = msg.content!.indexOf(a.selector.exact, cursor);
    if (idx > cursor) {
      parts.push(msg.content!.slice(cursor, idx));
    }

    const anchorText = a.selector.exact;

    parts.push(
      <AnchorSpan
        key={a.id}
        anchor={a}
        text={anchorText}
        currentPath={pathIds}
      />
    );

    cursor = idx + anchorText.length;
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

    const selector = rangeToSelector(spanRef.current!, sel.range);
    const childId = await branch(threadId, msg.id, selector);
    router.push(`/t/${[...pathIds, childId].join("/")}`);
  };

  if (isUser) {
    return (
      <li className="flex justify-end mb-8">
        <div className="bg-gray-200 text-gray-800 rounded-xl px-3 py-2 max-w-[60%]">
          <p className="whitespace-pre-wrap align-right">{parts}</p>
        </div>
      </li>
    );
  }

  return (
    <li className="text-gray-800 mb-8">
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
