import { useEffect, useRef, useState } from "react";

export function Reticle() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;
    let magnetX = 0;
    let magnetY = 0;
    let hoverLabel = "";

    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      setVisible(true);

      const t = e.target as HTMLElement | null;
      const mag = t?.closest<HTMLElement>("[data-magnetic], a, button, [role='button'], input, textarea");
      if (mag) {
        const r = mag.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        magnetX = (cx - x) * 0.28;
        magnetY = (cy - y) * 0.28;
        hoverLabel = mag.getAttribute("data-label") || mag.tagName.toLowerCase();
        ring.current?.classList.add("is-active");
      } else {
        magnetX = 0;
        magnetY = 0;
        hoverLabel = "";
        ring.current?.classList.remove("is-active");
      }
    };

    const leave = () => setVisible(false);

    const tick = () => {
      rx += (x + magnetX - rx) * 0.22;
      ry += (y + magnetY - ry) * 0.22;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      if (readoutRef.current) {
        readoutRef.current.style.transform = `translate3d(${rx + 22}px, ${ry + 14}px, 0)`;
        readoutRef.current.textContent = `${String(Math.round(x)).padStart(4, "0")}·${String(
          Math.round(y),
        ).padStart(4, "0")}${hoverLabel ? ` // ${hoverLabel}` : ""}`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseleave", leave);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 90,
        opacity: visible ? 1 : 0,
        transition: "opacity 200ms",
        mixBlendMode: "difference",
      }}
    >
      <div
        ref={ring}
        className="reticle-ring"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          marginLeft: -18,
          marginTop: -18,
          border: "1px solid #ffffff",
          borderRadius: "50%",
          transition: "width 200ms, height 200ms, margin 200ms",
        }}
      />
      <div
        ref={dot}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 4,
          height: 4,
          marginLeft: -2,
          marginTop: -2,
          background: "#ffffff",
          borderRadius: "50%",
        }}
      />
      {/* crosshair spokes */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1,
          height: 12,
          marginLeft: 0,
          marginTop: -18,
          background: "#ffffff",
          transform: dot.current?.style.transform,
        }}
      />
      <div
        ref={readoutRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.12em",
          color: "#ffffff",
          whiteSpace: "nowrap",
        }}
      />
      <style>{`.reticle-ring.is-active { width: 52px !important; height: 52px !important; margin-left: -26px !important; margin-top: -26px !important; border-color: #7EC8E3 !important; box-shadow: 0 0 0 1px rgba(126,200,227,0.25), 0 0 24px rgba(126,200,227,0.5); }`}</style>
    </div>
  );
}
