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
        position: "fixed",
        top: rect.bottom + 10,
        left: rect.left + 20,
        zIndex: 1000,
      }}
      className="cursor-pointer bg-blue-600 text-white text-md font-bold px-2 py-1 rounded shadow h-10"
      onMouseDown={(e) => e.preventDefault()}
      onTouchStart={(e) => e.preventDefault()}
      onClick={onClick}
    >
      + Branch
    </button>
  );
}
