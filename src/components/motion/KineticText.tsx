"use client";

import { useEffect, useRef } from "react";
import { MotionEngine } from "./MotionEngine";
import { useMotion } from "./MotionContext";
import styles from "./KineticText.module.css";

type Props = {
  lines: string[];
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  restWidth?: number;
  restWeight?: number;
  maxWidth?: number;
  minWeight?: number;
  radius?: number;
  /**
   * Ease-back time constant after the cursor stops (~0.2s of visible settle).
   * Larger = slower return.
   */
  settleDuration?: number;
};

/** Exponential ease, most of the ease-back plays out over `duration` seconds */
function settleFactor(duration: number, dt: number) {
  const tau = Math.max(0.05, duration);
  return 1 - Math.exp(-Math.max(0, dt) / tau);
}

export function KineticText({
  lines,
  className,
  as: Tag = "h1",
  restWidth = 70,
  restWeight = 800,
  maxWidth = 125,
  minWeight = 260,
  radius = 420,
  settleDuration = 0.2,
}: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const { reducedMotion, isTouch, ready } = useMotion();

  // Desktop: cursor proximity warp
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion || isTouch || !ready) return;

    const letters = [
      ...root.querySelectorAll<HTMLElement>("[data-letter]"),
    ];
    // Per-letter influence 0→1, lerped so it eases back after the cursor stops
    const influence = letters.map(() => 0);
    const applied = letters.map(() => -1);

    const unsub = MotionEngine.subscribe((s) => {
      const { x, y } = s.pointer;
      const k = settleFactor(settleDuration, s.dt);

      for (let i = 0; i < letters.length; i++) {
        const el = letters[i];
        const r = el.getBoundingClientRect();
        if (r.bottom < -40 || r.top > window.innerHeight + 40) {
          influence[i] += (0 - influence[i]) * k;
          continue;
        }

        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = Math.hypot(cx - x, cy - y);
        let target = 0;
        if (dist < radius) {
          const t = 1 - dist / radius;
          target = t * t * (3 - 2 * t);
        }

        influence[i] += (target - influence[i]) * k;

        const h = influence[i];
        if (Math.abs(h - applied[i]) < 0.004) continue;
        applied[i] = h;

        if (h < 0.01) {
          el.style.fontVariationSettings = `"wdth" ${restWidth}, "wght" ${restWeight}`;
          continue;
        }

        const wdth = restWidth + (maxWidth - restWidth) * h;
        const wght = restWeight + (minWeight - restWeight) * h;
        el.style.fontVariationSettings = `"wdth" ${wdth.toFixed(1)}, "wght" ${wght.toFixed(0)}`;
      }
    });

    return unsub;
  }, [
    reducedMotion,
    isTouch,
    ready,
    restWidth,
    restWeight,
    maxWidth,
    minWeight,
    radius,
    settleDuration,
  ]);

  // Mobile: one-shot weight/width wave when the block enters the viewport
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion || !isTouch || !ready) return;

    const letters = [
      ...root.querySelectorAll<HTMLElement>("[data-letter]"),
    ];
    if (letters.length === 0) return;

    let played = false;
    let raf = 0;

    const wave = () => {
      if (played) return;
      played = true;
      const start = performance.now();
      const peak = 0.55;
      const duration = 900 + letters.length * 18;

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        for (let i = 0; i < letters.length; i++) {
          const local = t * 1.35 - (i / letters.length) * 0.55;
          const h =
            local <= 0 || local >= 1
              ? 0
              : Math.sin(local * Math.PI) * peak;
          const wdth = restWidth + (maxWidth - restWidth) * h;
          const wght = restWeight + (minWeight - restWeight) * h;
          letters[i].style.fontVariationSettings = `"wdth" ${wdth.toFixed(1)}, "wght" ${wght.toFixed(0)}`;
        }
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting && e.intersectionRatio > 0.35)) {
          wave();
          io.disconnect();
        }
      },
      { threshold: [0.35, 0.55] },
    );
    io.observe(root);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [
    reducedMotion,
    isTouch,
    ready,
    restWidth,
    restWeight,
    maxWidth,
    minWeight,
  ]);

  return (
    <Tag
      ref={rootRef as never}
      className={[styles.root, className].filter(Boolean).join(" ")}
    >
      <span className="sr-only">{lines.join(" ")}</span>
      {lines.map((line, li) => (
        <span key={li} className={styles.line} aria-hidden>
          {line.split("").map((ch, i) =>
            ch === " " ? (
              <span key={`${li}-${i}`} className={styles.space}>
                {" "}
              </span>
            ) : (
              <span
                key={`${li}-${i}`}
                data-letter
                className={styles.letter}
                style={{
                  fontVariationSettings: `"wdth" ${restWidth}, "wght" ${restWeight}`,
                }}
              >
                {ch}
              </span>
            ),
          )}
        </span>
      ))}
    </Tag>
  );
}
