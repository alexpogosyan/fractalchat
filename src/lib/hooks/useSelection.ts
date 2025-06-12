import { useEffect, useState } from "react";

export function useTextSelection(ref: React.RefObject<HTMLElement | null>) {
  const [info, setInfo] = useState<{
    text: string;
    range: Range | null;
  } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseUp = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        setInfo(null);
        return;
      }

      const range = sel.getRangeAt(0);
      if (!el.contains(range.commonAncestorContainer)) {
        setInfo(null);
        return;
      }

      setInfo({ text: sel.toString(), range });
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [ref]);

  return info; // null | { text, range }
}
