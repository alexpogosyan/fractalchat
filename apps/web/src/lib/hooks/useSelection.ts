import { useEffect, useState } from "react";

export function useTextSelection(ref: React.RefObject<HTMLElement | null>) {
  const [info, setInfo] = useState<{
    text: string;
    range: Range | null;
  } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // shared handler for when the user finishes (or updates) a text selection.
    const handleSelection = () => {
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

    // Desktop browsers usually finish selection on "mouseup". On mobile Safari,
    // we rely on the "selectionchange" event because no mouse events are
    // dispatched when using the long-press text selector. We still keep the
    // "mouseup" listener for completeness and other environments.
    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("selectionchange", handleSelection);
    // Some mobile browsers (older Android) emit a "touchend" when selection is
    // completed, so we capture that as well.
    document.addEventListener("touchend", handleSelection);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("selectionchange", handleSelection);
      document.removeEventListener("touchend", handleSelection);
    };
  }, [ref]);

  return info; // null | { text, range }
}
