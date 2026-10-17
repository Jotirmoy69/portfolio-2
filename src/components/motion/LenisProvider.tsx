"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { useMotion } from "./MotionContext";
import { MotionEngine } from "./MotionEngine";
import { setLenis } from "./smoothScroll";

export function LenisProvider({ children }: { children: ReactNode }) {
  const { reducedMotion, ready } = useMotion();

  useEffect(() => {
    if (!ready || reducedMotion) {
      setLenis(null);
      return;
    }

    // Wheel/trackpad: short lerp only — NOT the long Apple click animation
    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      autoRaf: false,
      anchors: false,
    });
    setLenis(lenis);
    lenis.start();
    document.documentElement.classList.add("lenis", "lenis-smooth");

    const unsub = MotionEngine.subscribe(() => {
      lenis.raf(performance.now());
    });

    return () => {
      unsub();
      setLenis(null);
      lenis.destroy();
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };
  }, [ready, reducedMotion]);

  return children;
}
