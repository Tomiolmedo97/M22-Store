import { useEffect, useRef, type ReactNode } from "react";

export function OfferAtmosphere({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine) and (min-width: 768px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (document.hidden) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const box = el.getBoundingClientRect();
        const x = ((e.clientX - box.left) / box.width) * 100;
        const y = ((e.clientY - box.top) / box.height) * 100;
        el.style.setProperty("--spot-x", `${x}%`);
        el.style.setProperty("--spot-y", `${y}%`);
      });
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <section id="top" ref={ref} className="fx-offer relative overflow-hidden border-b border-border">
      <div className="fx-mesh" aria-hidden="true" />
      <div className="fx-spot" aria-hidden="true" />
      <div className="fx-vignette" aria-hidden="true" />
      <div className="fx-grain" aria-hidden="true" />
      {children}
    </section>
  );
}
