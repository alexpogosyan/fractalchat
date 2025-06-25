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
        top: rect.top + window.scrollY - 40,
        left: rect.left + window.scrollX,
        zIndex: 1000,
      }}
      className="cursor-pointer bg-blue-600 text-white text-lg font-bold px-2 py-1 rounded shadow w-10 h-10"
      onClick={onClick}
    >
      +
    </button>
  );
}
