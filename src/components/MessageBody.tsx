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
      if (!a.selector.exact.trim()) return; // ignore empty/whitespace anchors
      try {
        const range = selectorToRange(root, a.selector);
        if (!range) return;

        const applyWrapper = (r: Range) => {
          const wrapper = document.createElement("span");
          wrapper.dataset.anchorId = a.id;
          wrapper.className =
            "bg-yellow-200 rounded px-1 cursor-pointer select-none";
          wrapper.onclick = () =>
            router.push(`/t/${[...pathIds, a.thread_id].join("/")}`);
          r.surroundContents(wrapper);
        };

        try {
          applyWrapper(range);
        } catch {
          // Range crosses multiple nodes — wrap each intersecting text node individually
          const walker = document.createTreeWalker(
            range.commonAncestorContainer,
            NodeFilter.SHOW_TEXT
          );
          const textNodes: Node[] = [];
          for (let n = walker.nextNode(); n; n = walker.nextNode()) {
            if (range.intersectsNode(n)) textNodes.push(n);
          }
          textNodes.forEach((n) => {
            const sub = document.createRange();
            const isStart = n === range.startContainer;
            const isEnd = n === range.endContainer;
            const start = isStart ? range.startOffset : 0;
            const end = isEnd ? range.endOffset : n.textContent?.length ?? 0;
            sub.setStart(n, start);
            sub.setEnd(n, end);
            if (sub.toString().trim()) applyWrapper(sub);
          });
        }
      } catch {
        /* selector not found */
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
