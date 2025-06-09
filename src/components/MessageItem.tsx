// components/features/ThreadView/MessageItem.tsx
import { useAnchorsForMessage } from "@/store/selectors";
import type { Message } from "@/types";
import AnchorSpan from "./AnchorSpan";

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

  return (
    <p className={msg.sender === "user" ? "text-blue-700" : "text-gray-800"}>
      {parts}
    </p>
  );
}
