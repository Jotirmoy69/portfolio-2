"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { MotionEngine } from "@/components/motion/MotionEngine";
import { useMotion } from "@/components/motion/MotionContext";
import { Highlighter } from "@/components/ui/highlighter";
import styles from "./Statement.module.css";

const DIM = 0.14;
/** Play underline once this word is mostly lit (0→1 scroll reveal) */
const HIGHLIGHT_AT = 0.72;

export function Statement() {
  const pinRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  const markLit = useRef(false);
  const { reducedMotion, ready } = useMotion();
  const { label, text, words } = site.statement;
  const highlightIndex = words.findIndex(
    (w) => "highlight" in w && w.highlight,
  );
  const [markActive, setMarkActive] = useState(false);
  const markOn = reducedMotion || markActive;

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

      if (highlightIndex < 0) return;
      const lit = exact - highlightIndex >= HIGHLIGHT_AT;
      if (lit !== markLit.current) {
        markLit.current = lit;
        setMarkActive(lit);
      }
    });
    return unsub;
  }, [ready, reducedMotion, words.length, highlightIndex]);

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
            const href = "href" in word ? word.href : undefined;
            const highlight = "highlight" in word && word.highlight;

            const content = href ? (
              <a
                href={href}
                className={styles.link}
                target="_blank"
                rel="noreferrer"
                data-cursor="Open"
              >
                {word.text}
              </a>
            ) : (
              word.text
            );

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
                aria-hidden={href ? undefined : true}
                data-w=""
                style={{ opacity: reducedMotion ? 1 : DIM }}
              >
                {highlight ? (
                  <Highlighter
                    action="underline"
                    color="#7FA8FF"
                    active={markOn}
                    iterations={2}
                    animationDuration={800}
                    strokeWidth={2}
                    padding={2}
                  >
                    {content}
                  </Highlighter>
                ) : (
                  content
                )}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
