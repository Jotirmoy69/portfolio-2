"use client";

import { useEffect, useRef, useState } from "react";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { MotionEngine } from "./MotionEngine";
import { useMotion } from "./MotionContext";
import styles from "./Cursor.module.css";

/**
 * Default: Magic UI Smooth Cursor.
 * On [data-cursor] hover: cursor becomes the gooey View pill (Skiper 64).
 */
export function Cursor() {
  const { reducedMotion, isTouch, ready } = useMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [active, setActive] = useState(false);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    if (reducedMotion || isTouch || !ready) return;

    const onOver = (e: Event) => {
      const t = (e.target as HTMLElement)?.closest?.(
        "[data-cursor]",
      ) as HTMLElement | null;
      if (!t) {
        setActive(false);
        setLabel("");
        return;
      }
      const raw = (t.dataset.cursor || "").trim();
      const custom = (t.dataset.cursorLabel || "").trim();
      if (raw === "outline" || raw === "default") {
        setActive(false);
        setLabel("");
        return;
      }
      setLabel(custom || raw || "View");
      setActive(true);
    };

    document.addEventListener("mouseover", onOver);

    const unsub = MotionEngine.subscribe((s) => {
      pos.current.tx = s.pointer.x;
      pos.current.ty = s.pointer.y;
      pos.current.x += (pos.current.tx - pos.current.x) * 0.14;
      pos.current.y += (pos.current.ty - pos.current.y) * 0.14;
      if (rootRef.current) {
        rootRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
    });

    return () => {
      document.removeEventListener("mouseover", onOver);
      unsub();
    };
  }, [reducedMotion, isTouch, ready]);

  if (reducedMotion || isTouch || !ready) return null;

  return (
    <>
      <div
        style={{
          opacity: active ? 0 : 1,
          transition: "opacity 0.2s",
          pointerEvents: "none",
        }}
        aria-hidden
      >
        <SmoothCursor />
      </div>

      <div
        ref={rootRef}
        className={`${styles.gooey} ${active ? styles.active : ""}`}
        aria-hidden
      >
        <span className={styles.blob} />
        <span className={styles.pill}>
          <span className={styles.label}>{label}</span>
        </span>
      </div>
    </>
  );
}
