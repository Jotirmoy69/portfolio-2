"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { site } from "@/content/site";
import { MotionEngine } from "./MotionEngine";
import { useReducedMotion } from "./useReducedMotion";

type MotionContextValue = {
  ready: boolean;
  setReady: (v: boolean) => void;
  reducedMotion: boolean;
  motionPaused: boolean;
  setMotionPaused: (v: boolean) => void;
  accent: string;
  setAccentIndex: (i: number) => void;
  cycleAccent: () => void;
  isTouch: boolean;
};

const MotionContext = createContext<MotionContextValue | null>(null);

export function MotionProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [motionPaused, setMotionPausedState] = useState(false);
  const [accentIndex, setAccentIndex] = useState(0);
  const [isTouch, setIsTouch] = useState(false);

  const accent = site.accents[accentIndex % site.accents.length];

  const setMotionPaused = useCallback((v: boolean) => {
    setMotionPausedState(v);
    MotionEngine.setMotionPaused(v);
  }, []);

  const cycleAccent = useCallback(() => {
    setAccentIndex((i) => (i + 1) % site.accents.length);
  }, []);

  useEffect(() => {
    MotionEngine.setReducedMotion(reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
  }, [accent]);

  useEffect(() => {
    MotionEngine.start();
    const mq = window.matchMedia("(pointer: coarse)");
    const sync = () => {
      setIsTouch(mq.matches || navigator.maxTouchPoints > 0);
    };
    // Defer past effect body (avoids sync setState-in-effect lint)
    const id = requestAnimationFrame(sync);
    mq.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(id);
      mq.removeEventListener("change", sync);
      MotionEngine.stop();
    };
  }, []);

  useEffect(() => {
    let buffer = "";
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-3);
      if (buffer === "tea") {
        setAccentIndex(1);
        buffer = "";
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      setReady,
      reducedMotion,
      motionPaused,
      setMotionPaused,
      accent,
      setAccentIndex,
      cycleAccent,
      isTouch,
    }),
    [
      ready,
      reducedMotion,
      motionPaused,
      setMotionPaused,
      accent,
      cycleAccent,
      isTouch,
    ],
  );

  return (
    <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
  );
}

export function useMotion() {
  const ctx = useContext(MotionContext);
  if (!ctx) throw new Error("useMotion must be used within MotionProvider");
  return ctx;
}
