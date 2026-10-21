"use client";

/**
 * Mike Wilcock style page cover:
 * Accent bars rise from the bottom (L→R), title builds letter-by-letter,
 * then bars exit upward to reveal the next page.
 * https://mikewilcockdesign.com/work/portfolio
 */

import { motion, useReducedMotion } from "motion/react";
import styles from "./StairsTransition.module.css";

export type StairsPhase = "idle" | "closing" | "opening";

const COLUMNS = 5;
const STAGGER = 0.08;
const BAR_DURATION = 0.62;
const EASE = [0.76, 0, 0.24, 1] as const;

export function stairsDurationMs(columns = COLUMNS) {
  // Bars + title settle before navigate / reveal
  return (BAR_DURATION + Math.max(0, columns - 1) * STAGGER + 0.45) * 1000;
}

type Props = {
  phase: StairsPhase;
  label?: string;
  columns?: number;
  onCloseComplete?: () => void;
  onOpenComplete?: () => void;
};

export function StairsTransition({
  phase,
  label = "Next",
  columns = COLUMNS,
  onCloseComplete,
  onOpenComplete,
}: Props) {
  const reduce = Boolean(useReducedMotion());

  if (phase === "idle") return null;

  const closing = phase === "closing";
  const letters = Array.from(label.replace(/\s+/g, " ").trim() || "Next");

  const delayFor = (index: number) => index * STAGGER;
  const lastIndex = columns - 1;

  return (
    <div
      className={styles.overlay}
      role="status"
      aria-live="polite"
      aria-busy={closing}
    >
      <span className="sr-only">
        {closing ? `Loading ${label}` : "Page ready"}
      </span>

      <div className={styles.bars} aria-hidden>
        {Array.from({ length: columns }, (_, index) => (
          <motion.div
            key={`${phase}-bar-${index}`}
            className={styles.bar}
            initial={
              closing
                ? { y: "101%" }
                : { y: "0%" }
            }
            animate={
              reduce
                ? {
                    y: closing ? "0%" : "-101%",
                    transition: { duration: 0 },
                  }
                : closing
                  ? {
                      y: "0%",
                      transition: {
                        duration: BAR_DURATION,
                        ease: EASE,
                        delay: delayFor(index),
                      },
                    }
                  : {
                      y: "-101%",
                      transition: {
                        duration: BAR_DURATION,
                        ease: EASE,
                        delay: delayFor(index),
                      },
                    }
            }
            onAnimationComplete={
              index === lastIndex && !closing
                ? () => onOpenComplete?.()
                : undefined
            }
          />
        ))}
      </div>

      <div className={styles.text} aria-hidden>
        <motion.div
          className={styles.meta}
          initial={{ opacity: 0 }}
          animate={
            closing
              ? {
                  opacity: 1,
                  transition: {
                    delay: reduce ? 0 : BAR_DURATION * 0.45,
                    duration: reduce ? 0 : 0.35,
                  },
                }
              : {
                  opacity: 0,
                  transition: { duration: reduce ? 0 : 0.2 },
                }
          }
        >
          <span>(Next)</span>
          <span />
        </motion.div>

        <div className={styles.label}>
          {letters.map((ch, i) =>
            ch === " " ? (
              <span key={`sp-${i}`} style={{ width: "0.35em" }} />
            ) : (
              <span key={`${phase}-${ch}-${i}`} className={styles.clip}>
                <motion.span
                  className={styles.letter}
                  initial={
                    closing
                      ? {
                          y: "110%",
                          fontVariationSettings: `"wdth" 118, "wght" 280`,
                        }
                      : {
                          y: "0%",
                          fontVariationSettings: `"wdth" 70, "wght" 800`,
                        }
                  }
                  animate={
                    closing
                      ? {
                          y: "0%",
                          fontVariationSettings: `"wdth" 70, "wght" 800`,
                          transition: {
                            duration: reduce ? 0 : 0.55,
                            ease: EASE,
                            delay: reduce
                              ? 0
                              : BAR_DURATION * 0.35 + i * 0.035,
                          },
                        }
                      : {
                          y: "110%",
                          transition: {
                            duration: reduce ? 0 : 0.28,
                            ease: EASE,
                            delay: reduce ? 0 : i * 0.02,
                          },
                        }
                  }
                >
                  {ch}
                </motion.span>
              </span>
            ),
          )}
        </div>

        <motion.div
          className={styles.line}
          initial={{ scaleX: 0 }}
          animate={
            closing
              ? {
                  scaleX: 1,
                  transition: {
                    delay: reduce ? 0 : BAR_DURATION * 0.5,
                    duration: reduce ? 0 : 0.45,
                    ease: EASE,
                  },
                }
              : {
                  scaleX: 0,
                  transition: { duration: reduce ? 0 : 0.25 },
                }
          }
          onAnimationComplete={
            closing
              ? () => {
                  // Title + line settled, navigate
                  onCloseComplete?.();
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
