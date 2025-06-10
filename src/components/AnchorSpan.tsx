"use client";
import { useRouter } from "next/navigation";
import type { Anchor } from "@/types";

export default function AnchorSpan({
  anchor,
  text,
  currentPath,
}: {
  anchor: Anchor;
  text: string;
  currentPath: string[];
}) {
  const router = useRouter();

  const goto = () =>
    router.push(`/t/${[...currentPath, anchor.thread_id].join("/")}`);

  return (
    <span className="bg-yellow-200 inline-flex items-center gap-1 rounded px-1">
      <button onClick={goto} className="hover:cursor-pointer">
        {text}
      </button>
    </span>
  );
}
