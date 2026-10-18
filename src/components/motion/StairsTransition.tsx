"use client";

/**
 * Stairs page transition — adapted from SmoothUI Page Preloader (`variant="stairs"`).
 * https://smoothui.dev/docs/components/page-preloader
 *
 * Close: columns rise from the bottom, right → left.
 * Open: columns drop downward off-screen, left → right.
 * Fill is solid white so the previous page never ghosts through.
 */

import { motion, useReducedMotion } from "motion/react";
import styles from "./StairsTransition.module.css";

export type StairsPhase = "idle" | "closing" | "opening";

const COLUMNS = 6;
const STAGGER = 0.07;
const DURATION = 0.55;
const EASE = [0.645, 0.045, 0.355, 1] as const;

export function stairsDurationMs(columns = COLUMNS) {
  return (DURATION + Math.max(0, columns - 1) * STAGGER) * 1000;
}

type Props = {
  phase: StairsPhase;
  columns?: number;
  onCloseComplete?: () => void;
  onOpenComplete?: () => void;
};

export function StairsTransition({
  phase,
  columns = COLUMNS,
  onCloseComplete,
  onOpenComplete,
}: Props) {
  const reduce = Boolean(useReducedMotion());

  if (phase === "idle") return null;

  const closing = phase === "closing";

  // Close: right column first. Open: left column first.
  const delayFor = (index: number) =>
    closing
      ? (columns - 1 - index) * STAGGER
      : index * STAGGER;

  const lastIndex = closing ? 0 : columns - 1;

  return (
    <div
      className={styles.overlay}
      role="status"
      aria-live="polite"
      aria-busy={closing}
    >
      <span className="sr-only">
        {closing ? "Loading page" : "Page ready"}
      </span>
      {Array.from({ length: columns }, (_, index) => (
        <motion.div
          key={`${phase}-${index}`}
          className={styles.column}
          aria-hidden
          style={{
            transformOrigin: closing ? "bottom" : "top",
          }}
          initial={
            closing
              ? { scaleY: 0, y: 0 }
              : { scaleY: 1, y: 0 }
          }
          animate={
            reduce
              ? {
                  scaleY: closing ? 1 : 0,
                  y: closing ? 0 : "100%",
                  transition: { duration: 0 },
                }
              : closing
                ? {
                    // Rise from the bottom to cover
                    scaleY: 1,
                    y: 0,
                    transition: {
                      duration: DURATION,
                      ease: EASE,
                      delay: delayFor(index),
                    },
                  }
                : {
                    // Drop downward to reveal (up → down)
                    scaleY: 1,
                    y: "100%",
                    transition: {
                      duration: DURATION,
                      ease: EASE,
                      delay: delayFor(index),
                    },
                  }
          }
          onAnimationComplete={
            index === lastIndex
              ? () => {
                  if (closing) onCloseComplete?.();
                  else onOpenComplete?.();
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}
