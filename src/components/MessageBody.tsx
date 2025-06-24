import React, { useLayoutEffect, useRef, forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { selectorToRange } from "@/lib/anchors";
import type { Anchor } from "@/types/app";
import { useRouter } from "next/navigation";

interface Props {
  content: string;
  anchors: Anchor[];
  pathIds: string[];
}

const MessageBody = forwardRef<HTMLDivElement, Props>(function MessageBody(
  { content, anchors, pathIds },
  ref
) {
  const innerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // merge refs so both forwardRef and internal logic share same node
  const setRefs = (node: HTMLDivElement | null) => {
    innerRef.current = node;
    if (ref) {
      if (typeof ref === "function") {
        ref(node);
      } else {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    }
  };
  const rootRef = innerRef;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // remove previous highlights
    root.querySelectorAll("span[data-anchor-id]").forEach((el) => {
      const span = el as HTMLSpanElement;
      const parent = span.parentNode;
      if (!parent) return;
      while (span.firstChild) parent.insertBefore(span.firstChild, span);
      parent.removeChild(span);
      parent.normalize();
    });

    // apply current anchors
    anchors.forEach((a) => {
      try {
        const range = selectorToRange(root, a.selector);
        if (!range) return;

        const wrapper = document.createElement("span");
        wrapper.dataset.anchorId = a.id;
        wrapper.className =
          "bg-yellow-200 rounded px-1 cursor-pointer select-none";
        wrapper.onclick = () =>
          router.push(`/t/${[...pathIds, a.thread_id].join("/")}`);

        range.surroundContents(wrapper);
      } catch {
        /* overlapping ranges or stale selector */
      }
    });
  }, [content, anchors, pathIds, router, rootRef]);

  return (
    <div ref={setRefs} suppressHydrationWarning>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    </div>
  );
});

MessageBody.displayName = "MessageBody";

export default MessageBody;
