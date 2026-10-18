"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { projects } from "@/content/site";
import styles from "./UpClose.module.css";

type Frame = {
  src: string;
  label: string;
  id: string;
  /** Landscape mockups need a wide frame or object-fit:cover makes them look like the desktop shot */
  wide: boolean;
};

const DRAG_THRESHOLD = 8;

function isWideSrc(src: string, coverMobile?: string) {
  if (coverMobile && src === coverMobile) return true;
  return /_horizontal\.(jpe?g|png|webp)$/i.test(src);
}

export function UpClose() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useRef(0);
  const vx = useRef(0);
  const dragging = useRef(false);
  const armed = useRef(false);
  const start = useRef({ x: 0, y: 0, pointerId: -1 });
  const lastX = useRef(0);
  const raf = useRef(0);

  const frames = useMemo<Frame[]>(
    () =>
      projects.flatMap((p) => {
        // Prefer explicit desktop + mobile covers when both exist
        const shots =
          p.coverMobile != null
            ? [
                { src: p.cover, wide: false, kind: "Desktop" },
                { src: p.coverMobile, wide: true, kind: "Mobile" },
              ]
            : [...new Set(p.closeups)].map((src, i, arr) => ({
                src,
                wide: isWideSrc(src, p.coverMobile),
                kind:
                  arr.length < 2 ? "" : i === 0 ? "Desktop" : "Mobile",
              }));

        // Skip identical paths
        const seen = new Set<string>();
        return shots.flatMap((shot) => {
          if (seen.has(shot.src)) return [];
          seen.add(shot.src);
          return [
            {
              src: shot.src,
              wide: shot.wide,
              id: `${p.id}-${shot.wide ? "m" : "d"}`,
              label: shot.kind
                ? `(${p.index}) ${p.title} ${shot.kind}`
                : `(${p.index}) ${p.title}`,
            },
          ];
        });
      }),
    [],
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const clamp = () => {
      const max = 0;
      const min = Math.min(0, viewport.clientWidth - track.scrollWidth);
      x.current = Math.max(min, Math.min(max, x.current));
    };

    const render = () => {
      if (!dragging.current) {
        x.current += vx.current;
        vx.current *= 0.92;
        if (Math.abs(vx.current) < 0.05) vx.current = 0;
      }
      clamp();
      track.style.transform = `translate3d(${x.current}px, 0, 0)`;
      raf.current = requestAnimationFrame(render);
    };
    raf.current = requestAnimationFrame(render);

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      armed.current = false;
      dragging.current = false;
      start.current = { x: e.clientX, y: e.clientY, pointerId: e.pointerId };
      lastX.current = e.clientX;
      vx.current = 0;
    };

    const onMove = (e: PointerEvent) => {
      if (start.current.pointerId !== e.pointerId) return;

      if (!armed.current) {
        const dx = e.clientX - start.current.x;
        const dy = e.clientY - start.current.y;
        if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) {
          return;
        }
        // Vertical intent → let the page / Lenis scroll; don't capture
        if (Math.abs(dy) >= Math.abs(dx)) {
          start.current.pointerId = -1;
          return;
        }
        armed.current = true;
        dragging.current = true;
        lastX.current = e.clientX;
        try {
          viewport.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }

      if (!dragging.current) return;
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;
      x.current += dx;
      vx.current = dx;
      e.preventDefault();
    };

    const onUp = (e: PointerEvent) => {
      if (start.current.pointerId !== e.pointerId) return;
      if (dragging.current) {
        try {
          viewport.releasePointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }
      dragging.current = false;
      armed.current = false;
      start.current.pointerId = -1;
    };

    const onWheel = (e: WheelEvent) => {
      // Only hijack clear horizontal / shift-wheel; never block vertical page scroll
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.2 || e.shiftKey) {
        e.preventDefault();
        x.current -= e.deltaX || e.deltaY;
        vx.current = 0;
      }
    };

    viewport.addEventListener("pointerdown", onDown);
    viewport.addEventListener("pointermove", onMove, { passive: false });
    viewport.addEventListener("pointerup", onUp);
    viewport.addEventListener("pointercancel", onUp);
    viewport.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(raf.current);
      viewport.removeEventListener("pointerdown", onDown);
      viewport.removeEventListener("pointermove", onMove);
      viewport.removeEventListener("pointerup", onUp);
      viewport.removeEventListener("pointercancel", onUp);
      viewport.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <section className={styles.section} aria-labelledby="upclose-title">
      <div className={styles.head}>
        <h2 id="upclose-title" className={styles.title}>
          (Up close)
        </h2>
        <span className={`mono ${styles.hint}`}>Drag</span>
      </div>
      <div
        ref={viewportRef}
        className={styles.viewport}
        data-cursor="Look"
      >
        <div ref={trackRef} className={styles.track}>
          {frames.map((frame) => (
            <figure
              key={frame.id}
              className={`${styles.card} ${frame.wide ? styles.cardWide : ""}`}
            >
              <Image
                src={frame.src}
                alt=""
                width={frame.wide ? 1200 : 840}
                height={frame.wide ? 750 : 1050}
                sizes={
                  frame.wide
                    ? "(max-width: 720px) 88vw, 560px"
                    : "(max-width: 720px) 72vw, 420px"
                }
                draggable={false}
              />
              <figcaption className={styles.caption}>{frame.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
