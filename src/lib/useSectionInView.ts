import { useEffect, useRef } from "react";
import { sceneBus, type SectionId } from "./scene-bus";

export function useSectionInView(id: SectionId) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Trigger when the section crosses the vertical middle of the viewport.
    // Using a thin band via rootMargin works regardless of section height,
    // so tall sections on mobile/tablet still fire (fixes the previous
    // intersectionRatio > 0.4 threshold that never resolved on small screens).
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) sceneBus.set(id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id]);
  return ref;
}
