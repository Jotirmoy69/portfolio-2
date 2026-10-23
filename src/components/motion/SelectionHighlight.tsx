"use client";

import { useEffect, useRef } from "react";
import { annotate } from "rough-notation";
import type { RoughAnnotation } from "rough-notation/lib/model";
import { useMotion } from "./MotionContext";

type Mark = {
  el: HTMLElement;
  annotation: RoughAnnotation;
};

function accentColor() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--accent")
    .trim();
  return raw || "#7fa8ff";
}

/**
 * When the user selects text, draw a rough-notation underline
 * under each selection line (same library as Highlighter).
 */
export function SelectionHighlight() {
  const { reducedMotion, isTouch } = useMotion();
  const marksRef = useRef<Mark[]>([]);
  const rangeRef = useRef<Range | null>(null);

  useEffect(() => {
    if (reducedMotion || isTouch) return;

    const clear = () => {
      for (const mark of marksRef.current) {
        mark.annotation.remove();
        mark.el.remove();
      }
      marksRef.current = [];
      rangeRef.current = null;
    };

    const paint = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        clear();
        return;
      }

      const range = sel.getRangeAt(0);
      // Ignore selections inside inputs / editable fields
      const anchor = sel.anchorNode;
      const anchorEl =
        anchor?.nodeType === Node.TEXT_NODE
          ? anchor.parentElement
          : anchor instanceof Element
            ? anchor
            : null;
      if (anchorEl?.closest("input, textarea, [contenteditable='true']")) {
        clear();
        return;
      }

      clear();
      rangeRef.current = range.cloneRange();

      const color = accentColor();
      const rects = [...range.getClientRects()].filter(
        (r) => r.width > 2 && r.height > 2,
      );

      for (const rect of rects) {
        const el = document.createElement("span");
        el.setAttribute("data-selection-hl", "");
        el.setAttribute("aria-hidden", "true");
        el.style.cssText = [
          "position:fixed",
          `left:${rect.left}px`,
          `top:${rect.top}px`,
          `width:${Math.max(rect.width, 4)}px`,
          `height:${rect.height}px`,
          "pointer-events:none",
          "z-index:12000",
        ].join(";");
        document.body.appendChild(el);

        const annotation = annotate(el, {
          type: "underline",
          color,
          strokeWidth: 2,
          padding: 1,
          iterations: 2,
          animationDuration: 400,
          multiline: false,
        });
        annotation.show();
        marksRef.current.push({ el, annotation });
      }
    };

    const onSelectionChange = () => {
      // Only clear while empty; paint on mouseup / keyup so drag stays smooth
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) clear();
    };

    const onPointerUp = () => {
      window.requestAnimationFrame(paint);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift" || e.key.startsWith("Arrow") || e.key === "a" && (e.metaKey || e.ctrlKey)) {
        window.requestAnimationFrame(paint);
      }
    };

    const onScrollOrResize = () => {
      if (!rangeRef.current) return;
      // Re-measure from live selection if still present
      window.requestAnimationFrame(paint);
    };

    document.addEventListener("selectionchange", onSelectionChange);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      clear();
      document.removeEventListener("selectionchange", onSelectionChange);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [reducedMotion, isTouch]);

  return null;
}
