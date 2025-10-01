export default function HoverCard({
  show,
  x,
  y,
  children,
  onMouseEnter,
  onMouseLeave,
  transform = "translate(-50%, -100%)",
  className = "",
}) {
  if (!show) return null;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="fixed z-40 pointer-events-auto select-none"
      style={{ left: x, top: y, transform }}
    >
      <div className={`rounded-xl border bg-white p-3 text-xs shadow-lg ${className}`}>{children}</div>
    </div>
  );
}
