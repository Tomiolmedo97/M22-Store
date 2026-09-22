import { useEffect, useRef } from "react";

const LINE = "GRAN LIQUIDACIÓN  ·  3 REMERAS $70.000  ·  $23.000 C/U  ·  HASTA EL 1° DE OCTUBRE  ·  ";

export function OfferMarquee() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = () => {
      el.style.animationPlayState = document.hidden ? "paused" : "running";
    };
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return (
    <div className="fx-marquee border-y border-primary/30 bg-primary text-primary-fg" aria-hidden="true">
      <div ref={ref} className="fx-marquee-track font-display text-xl tracking-[0.18em] sm:text-2xl">
        <span>{LINE.repeat(6)}</span>
        <span>{LINE.repeat(6)}</span>
      </div>
    </div>
  );
}