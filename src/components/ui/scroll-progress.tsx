"use client";

import { motion, useScroll, useSpring, type MotionValue } from "motion/react";
import type { CSSProperties, RefObject } from "react";

type ScrollProgressProps = {
  /** Element whose scroll range drives the bar. Defaults to the document. */
  target?: RefObject<HTMLElement | null>;
  className?: string;
  style?: CSSProperties;
  /** Optional spring for smoother fill (Magic UI uses raw scroll by default). */
  smooth?: boolean;
};

/**
 * Magic UI Scroll Progress — https://magicui.design/docs/components/scroll-progress
 * Adapted for CSS modules (no Tailwind). scaleX follows scroll; reverses on scroll up.
 */
export function ScrollProgress({
  target,
  className,
  style,
  smooth = true,
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll(
    target
      ? {
          target,
          offset: ["start start", "end end"],
        }
      : undefined,
  );

  const springProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  });

  const scaleX: MotionValue<number> = smooth ? springProgress : scrollYProgress;

  return (
    <motion.div
      className={className}
      style={{
        transformOrigin: "0% 50%",
        scaleX,
        ...style,
      }}
    />
  );
}
