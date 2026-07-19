// Aurora aurora-wash backdrop for the hero — subtle gradient blobs + orbital rings.
export function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="aurora-wash absolute inset-0 opacity-70" />
      {/* Orbital rings */}
      <svg
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-slow"
        width="820"
        height="820"
        viewBox="0 0 820 820"
        fill="none"
      >
        <circle cx="410" cy="410" r="380" stroke="currentColor" strokeOpacity="0.08" />
        <circle cx="410" cy="410" r="300" stroke="currentColor" strokeOpacity="0.06" />
        <circle cx="410" cy="410" r="220" stroke="currentColor" strokeOpacity="0.05" />
        <circle cx="410" cy="30" r="3" fill="var(--pink)" />
        <circle cx="790" cy="410" r="2" fill="var(--violet)" />
      </svg>
      {/* Faint dotted grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--foreground) 18%, transparent) 1px, transparent 0)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        }}
      />
    </div>
  );
}
