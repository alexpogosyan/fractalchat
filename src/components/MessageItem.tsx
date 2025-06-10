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

  const isUser = msg.sender === "user";

  if (isUser) {
    return (
      <li className="flex justify-end">
        <div className="bg-gray-200 text-gray-800 rounded-xl px-3 py-2">
          <p className="whitespace-pre-wrap align-right">{parts}</p>
        </div>
      </li>
    );
  }

  return (
    <li className="text-gray-800">
      <p className="whitespace-pre-wrap">{parts}</p>
    </li>
  );
}
