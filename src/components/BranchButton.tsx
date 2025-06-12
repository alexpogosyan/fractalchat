export function BranchButton({
  rect,
  onClick,
}: {
  rect: DOMRect;
  onClick: () => void;
}) {
  return (
    <button
      style={{
        position: "absolute",
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        zIndex: 1000,
      }}
      className="bg-blue-600 text-white text-xs px-2 py-1 rounded shadow"
      onClick={onClick}
    >
      Branch
    </button>
  );
}
