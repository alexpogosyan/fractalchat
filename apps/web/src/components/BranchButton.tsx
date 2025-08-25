export function BranchButton({
  rect,
  onClick,
}: {
  rect: DOMRect;
  onClick: () => void;
}) {
  // Always position the button below the selection. This avoids being hidden
  // by the native copy / lookup menu that browsers (especially iOS Safari)
  // show above the selected text.
  const top = rect.bottom + window.scrollY + 10; // 10 px gap under selection

  // Position the button aligned with the left edge of the selection.
  const left = rect.left + window.scrollX;

  return (
    <button
      style={{
        position: "absolute",
        top,
        left,
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
