"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useStore } from "@/store/useStore";

const ellipsize = (s: string | null, n = 20) =>
  !s ? "Untitled" : s.length <= n ? s : s.slice(0, n - 1) + "…";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const ids = pathname.split("/").slice(2);

  const threads = useStore((s) => s.threads);
  const messages = useStore((s) => s.messages);

  const getLabel = useMemo(
    () => (threadId: string) => {
      const t = threads[threadId];
      if (!t) return "…";
      if (t.title) return ellipsize(t.title);

      const firstMsg = messages[threadId]?.[0]?.content ?? "";
      return ellipsize(firstMsg);
    },
    [threads, messages]
  );

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-white overflow-x-auto"
    >
      {ids.map((id, idx) => {
        const link = `/t/${ids.slice(0, idx + 1).join("/")}`;
        const isLast = idx === ids.length - 1;

        return (
          <span key={id} className="flex items-center gap-2">
            {idx > 0 && <ChevronRight className="w-3 h-3 text-gray-400" />}
            {isLast ? (
              <span className="font-medium truncate max-w-[12rem]">
                {getLabel(id)}
              </span>
            ) : (
              <Link
                href={link}
                className="truncate max-w-[10rem] text-blue-600 hover:underline"
              >
                {getLabel(id)}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
