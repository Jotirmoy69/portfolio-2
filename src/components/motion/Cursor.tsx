"use client";

import { useEffect, useRef, useState } from "react";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { MotionEngine } from "./MotionEngine";
import { useMotion } from "./MotionContext";
import styles from "./Cursor.module.css";

type Mode = "default" | "label" | "text";

function isInteractive(el: Element | null) {
  if (!el) return false;
  return Boolean(
    el.closest(
      "a, button, input, textarea, select, summary, [role='button'], [data-cursor]",
    ),
  );
}

/**
 * True only when the pointer is inside a real glyph box.
 * Nearby text from caretRangeFromPoint in empty padding does not count.
 */
function isOverText(x: number, y: number) {
  const hit = document.elementFromPoint(x, y);
  if (
    !hit ||
    hit === document.body ||
    hit === document.documentElement ||
    isInteractive(hit)
  ) {
    return false;
  }

  // Large layout shells are never "text" by themselves
  if (
    /^(MAIN|SECTION|ARTICLE|HEADER|FOOTER|NAV|ASIDE|DIV|UL|OL|FORM)$/.test(
      hit.tagName,
    )
  ) {
    // Allow if the event target is a nested text leaf checked below via caret
  }

  const doc = document as Document & {
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
    caretPositionFromPoint?: (
      x: number,
      y: number,
    ) => { offsetNode: Node; offset: number } | null;
  };

  let node: Node | null = null;
  let offset = 0;
  if (typeof doc.caretRangeFromPoint === "function") {
    const range = doc.caretRangeFromPoint(x, y);
    node = range?.startContainer ?? null;
    offset = range?.startOffset ?? 0;
  } else if (typeof doc.caretPositionFromPoint === "function") {
    const pos = doc.caretPositionFromPoint(x, y);
    node = pos?.offsetNode ?? null;
    offset = pos?.offset ?? 0;
  }

  if (!node || node.nodeType !== Node.TEXT_NODE) return false;

  const parent = node.parentElement;
  if (!parent || isInteractive(parent)) return false;

  const raw = node.textContent ?? "";
  if (!raw.replace(/\s+/g, "").length) return false;

  // Reject carets that landed on trailing/leading whitespace only
  const chLeft = raw[Math.max(0, offset - 1)] ?? "";
  const chRight = raw[offset] ?? "";
  if (!/\S/.test(chLeft) && !/\S/.test(chRight)) return false;

  // Must actually sit inside a painted glyph rect (stops empty / padding hits)
  const probe = document.createRange();
  try {
    const start = Math.max(0, offset - 1);
    const end = Math.min(raw.length, Math.max(offset + 1, start + 1));
    probe.setStart(node, start);
    probe.setEnd(node, end);
  } catch {
    return false;
  }

  const pad = 2;
  for (const r of probe.getClientRects()) {
    if (
      r.width < 1 ||
      r.height < 1 ||
      x < r.left - pad ||
      x > r.right + pad ||
      y < r.top - pad ||
      y > r.bottom + pad
    ) {
      continue;
    }
    return true;
  }

  return false;
}

function hasActiveTextSelection() {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || sel.rangeCount === 0) return false;
  return Boolean(sel.toString().replace(/\s+/g, "").length);
}

/**
 * Default: Magic UI Smooth Cursor.
 * On [data-cursor] hover: gooey View pill (Skiper 64).
 * On text hover: same arrow, rotation springs upright.
 */
export function Cursor() {
  const { reducedMotion, isTouch, ready } = useMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [mode, setMode] = useState<Mode>("default");
  const labelActive = useRef(false);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reducedMotion || isTouch || !ready) return;

    const setTextMode = (on: boolean) => {
      if (on) {
        if (leaveTimer.current) {
          clearTimeout(leaveTimer.current);
          leaveTimer.current = null;
        }
        setMode("text");
        return;
      }
      // Tiny leave delay so gaps between letters do not flicker
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
      leaveTimer.current = setTimeout(() => {
        leaveTimer.current = null;
        setMode((m) => (m === "text" ? "default" : m));
      }, 50);
    };

    const onOver = (e: Event) => {
      const t = (e.target as HTMLElement)?.closest?.(
        "[data-cursor]",
      ) as HTMLElement | null;
      if (!t) {
        labelActive.current = false;
        setMode((m) => (m === "label" ? "default" : m));
        setLabel("");
        return;
      }
      const raw = (t.dataset.cursor || "").trim();
      const custom = (t.dataset.cursorLabel || "").trim();
      if (raw === "outline" || raw === "default") {
        labelActive.current = false;
        setMode((m) => (m === "label" ? "default" : m));
        setLabel("");
        return;
      }
      labelActive.current = true;
      if (leaveTimer.current) {
        clearTimeout(leaveTimer.current);
        leaveTimer.current = null;
      }
      setLabel(custom || raw || "View");
      setMode("label");
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      if (labelActive.current) return;
      const overText = isOverText(e.clientX, e.clientY);
      const selecting = e.buttons === 1 && hasActiveTextSelection();
      setTextMode(overText || selecting);
    };

    document.addEventListener("mouseover", onOver);
    window.addEventListener("pointermove", onMove, { passive: true });

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
      window.removeEventListener("pointermove", onMove);
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
      unsub();
    };
  }, [reducedMotion, isTouch, ready]);

  if (reducedMotion || isTouch || !ready) return null;

  const showLabel = mode === "label";
  const showText = mode === "text";

  return (
    <>
      <div
        style={{
          opacity: showLabel ? 0 : 1,
          transition: "opacity 0.2s",
          pointerEvents: "none",
        }}
        aria-hidden
      >
        <SmoothCursor straight={showText} />
      </div>

      <div
        ref={rootRef}
        className={`${styles.gooey} ${showLabel ? styles.active : ""}`}
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
