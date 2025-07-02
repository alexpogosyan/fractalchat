export function BranchButton({
  rect,
  onClick,
}: {
  rect: DOMRect;
  onClick: () => void;
}) {
  // On mobile Safari, the system copy/find menu appears above the selection.
  // To prevent our button from being overlapped, we position it below the
  // selection on touch-only devices (no hover, coarse pointer).
  const isTouchOnly =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none) and (pointer: coarse)").matches;

  const top = isTouchOnly
    ? rect.bottom + window.scrollY + 10 // below selection
    : rect.top + window.scrollY - 40; // above selection for desktop

  return (
    <button
      style={{
        position: "absolute",
        top,
        left: rect.left + window.scrollX,
        zIndex: 1000,
      }}
      className="cursor-pointer bg-blue-600 text-white text-lg font-bold px-2 py-1 rounded shadow w-10 h-10"
      onMouseDown={(e) => e.preventDefault()}
      onTouchStart={(e) => e.preventDefault()}
      onClick={onClick}
    >
      +
    </button>
  );
}
