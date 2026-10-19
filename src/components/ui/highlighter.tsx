"use client";

import { useLayoutEffect, useRef } from "react";
import type React from "react";
import { useInView } from "motion/react";
import { annotate } from "rough-notation";
import type { RoughAnnotation } from "rough-notation/lib/model";

type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket";

interface HighlighterProps {
  children: React.ReactNode;
  action?: AnnotationAction;
  color?: string;
  strokeWidth?: number;
  animationDuration?: number;
  iterations?: number;
  padding?: number;
  multiline?: boolean;
  /** When true, draw only after the element scrolls into view */
  isView?: boolean;
  /**
   * Explicit play trigger. When set, overrides isView —
   * show when true, animate-hide when false.
   */
  active?: boolean;
  className?: string;
}

export function Highlighter({
  children,
  action = "highlight",
  color = "#ffd1dc",
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false,
  active,
  className,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const annotationRef = useRef<RoughAnnotation | null>(null);
  const shownRef = useRef(false);

  const isInView = useInView(elementRef, {
    once: false,
    amount: 0.7,
    margin: "0px 0px -18% 0px",
  });

  const shouldShow =
    active !== undefined ? active : !isView || isInView;

  // Create the annotation once; config updates recreate it
  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    annotationRef.current?.remove();
    shownRef.current = false;

    const annotation = annotate(element, {
      type: action,
      color,
      strokeWidth,
      animationDuration,
      iterations,
      padding,
      multiline,
    });
    annotationRef.current = annotation;

    if (shouldShow) {
      annotation.show();
      shownRef.current = true;
    }

    const resizeObserver = new ResizeObserver(() => {
      if (!shownRef.current || !annotationRef.current) return;
      annotationRef.current.hide();
      annotationRef.current.show();
    });
    // Delay so entrance / exit animations aren't interrupted
    const readyTimer = window.setTimeout(() => {
      resizeObserver.observe(element);
    }, animationDuration + 80);

    return () => {
      window.clearTimeout(readyTimer);
      resizeObserver.disconnect();
      annotation.remove();
      annotationRef.current = null;
      shownRef.current = false;
    };
    // shouldShow handled in the effect below — omit from deps so we don't remount on toggle
    // eslint-disable-next-line react-hooks/exhaustive-deps -- create once per style config
  }, [
    action,
    color,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline,
  ]);

  // Toggle show / hide with rough-notation's animated transitions
  useLayoutEffect(() => {
    const annotation = annotationRef.current;
    if (!annotation) return;

    if (shouldShow && !shownRef.current) {
      annotation.show();
      shownRef.current = true;
    } else if (!shouldShow && shownRef.current) {
      annotation.hide();
      shownRef.current = false;
    }
  }, [shouldShow]);

  return (
    <span ref={elementRef} className={className}>
      {children}
    </span>
  );
}
