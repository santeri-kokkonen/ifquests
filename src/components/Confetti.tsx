import { useEffect, useMemo, useState } from "react";

const COLORS = ["var(--primary)", "var(--success)", "var(--accent)", "var(--chart-4)"];

export function Confetti() {
  const [visible, setVisible] = useState(true);
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        left: 50 + (Math.random() - 0.5) * 40,
        dx: (Math.random() - 0.5) * 320,
        dy: 240 + Math.random() * 320,
        rot: Math.random() * 720 - 360,
        size: 6 + Math.random() * 6,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 120,
      })),
    [],
  );
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1400);
    return () => window.clearTimeout(timer);
  }, []);
  if (!visible) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            top: "-12px",
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            animationDelay: `${p.delay}ms`,
            ["--dx" as string]: `${p.dx}px`,
            ["--dy" as string]: `${p.dy}px`,
            ["--rot" as string]: `${p.rot}deg`,
          }}
        />
      ))}
    </div>
  );
}
