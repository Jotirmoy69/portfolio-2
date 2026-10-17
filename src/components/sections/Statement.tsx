"use client";

import { useEffect, useRef } from "react";
import { site } from "@/content/site";
import { MotionEngine } from "@/components/motion/MotionEngine";
import { useMotion } from "@/components/motion/MotionContext";
import styles from "./Statement.module.css";

const DIM = 0.14;

export function Statement() {
  const pinRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  const { reducedMotion, ready } = useMotion();
  const { label, text, words } = site.statement;

  useEffect(() => {
    const els = wordsRef.current;
    if (reducedMotion) {
      els.forEach((el) => {
        if (el) el.style.opacity = "1";
      });
      return;
    }
    if (!ready) return;

    const unsub = MotionEngine.subscribe(() => {
      const pin = pinRef.current;
      if (!pin) return;
      const rect = pin.getBoundingClientRect();
      const total = Math.max(1, pin.offsetHeight - window.innerHeight);
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = scrolled / total;
      const exact = progress * words.length;

      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        if (!el) continue;
        const t = Math.min(1, Math.max(0, exact - i));
        const opacity = DIM + t * (1 - DIM);
        el.style.opacity = opacity.toFixed(3);
      }
    });
    return unsub;
  }, [ready, reducedMotion, words.length]);

  return (
    <section
      ref={pinRef}
      className={styles.pin}
      id="about"
      data-pin=""
      aria-labelledby="about-label"
    >
      <div className={styles.sticky}>
        <span id="about-label" className={styles.label}>
          {label}
        </span>
        <p className={styles.text}>
          <span className="sr-only">{text}</span>
          {words.map((word, i) => {
            const italic = "italic" in word && word.italic;
            const accent = "accent" in word && word.accent;
            return (
              <span
                key={`${word.text}-${i}`}
                ref={(el) => {
                  if (el) wordsRef.current[i] = el;
                }}
                className={[
                  styles.word,
                  italic ? styles.italic : "",
                  accent ? styles.accent : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-hidden
                data-w=""
                style={{ opacity: reducedMotion ? 1 : DIM }}
              >
                {word.text}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
