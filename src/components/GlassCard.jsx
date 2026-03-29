export default function GlassCard({
  children,
  className = "",
  accent = "none",
  delay = 0,
}) {
  const accentClass =
    accent === "cyan"
      ? "glass-card-cyan"
      : accent === "pink"
      ? "glass-card-pink"
      : accent === "orange"
      ? "glass-card-orange"
      : "glass-card";

  return (
    <div
      className={`${accentClass} p-5 animate-fade-in ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
