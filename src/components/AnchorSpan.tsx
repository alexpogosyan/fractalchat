// components/primitives/AnchorSpan.tsx
"use client";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import type { Anchor } from "@/types";

export default function AnchorSpan({
  anchor,
  text,
  currentPath, // ["rootId", "subId"]
}: {
  anchor: Anchor;
  text: string;
  currentPath: string[];
}) {
  const router = useRouter();
  const toggle = useStore((s) => s.toggleAnchor);

  const goto = () =>
    router.push(
      `/t/${[...currentPath.slice(0, -1), anchor.thread_id].join("/")}`
    );

  return (
    <span className="bg-yellow-200/60 inline-flex items-center gap-1 rounded px-0.5">
      {/* full-text button */}
      <button onClick={goto} className="hover:underline">
        {text}
      </button>

      {/* chevron for inline preview */}
      <ChevronRight
        onClick={() => toggle(anchor.id)}
        className={`w-3 h-3 transition-transform`}
      />
    </span>
  );
}
