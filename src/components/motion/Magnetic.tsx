"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { MotionEngine } from "./MotionEngine";
import { useMotion } from "./MotionContext";

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** How strongly the element follows the pointer (MW ≈ 0.35). */
  strength?: number;
  /** Extra hit area around the element in px (MW ≈ 50). */
  padding?: number;
  /** Lerp factor toward the magnetic offset (MW ≈ 0.15). */
  settle?: number;
};

function lerpFactor(factor: number, dt: number) {
  return 1 - Math.pow(1 - factor, Math.max(0, dt) * 60);
}

/** MW-style magnetic pull, element eases toward the cursor nearby. */
export function Magnetic({
  children,
  className,
  style,
  strength = 0.35,
  padding = 50,
  settle = 0.15,
}: Props) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const offset = useRef({ x: 0, y: 0 });
  const { reducedMotion, isTouch, ready } = useMotion();

  useEffect(() => {
    const el = rootRef.current;
    if (!el || reducedMotion || isTouch || !ready) return;

    const unsub = MotionEngine.subscribe((s) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2 - offset.current.x;
      const cy = rect.top + rect.height / 2 - offset.current.y;
      const dx = s.pointer.x - cx;
      const dy = s.pointer.y - cy;
      const inRange =
        Math.abs(dx) < rect.width / 2 + padding &&
        Math.abs(dy) < rect.height / 2 + padding;

      const tx = inRange ? strength * dx : 0;
      const ty = inRange ? strength * dy : 0;
      const k = lerpFactor(settle, s.dt);
      offset.current.x += (tx - offset.current.x) * k;
      offset.current.y += (ty - offset.current.y) * k;

      el.style.transform = `translate3d(${offset.current.x.toFixed(2)}px, ${offset.current.y.toFixed(2)}px, 0)`;
    });

    return () => {
      unsub();
      el.style.transform = "";
    };
  }, [reducedMotion, isTouch, ready, strength, padding, settle]);

  return (
    <span
      ref={rootRef}
      className={className}
      style={{ display: "inline-block", willChange: "transform", ...style }}
    >
      {children}
    </span>
  );
}
