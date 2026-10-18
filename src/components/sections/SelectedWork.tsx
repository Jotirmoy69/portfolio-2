"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { projects } from "@/content/site";
import { MotionEngine } from "@/components/motion/MotionEngine";
import { useMotion } from "@/components/motion/MotionContext";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import styles from "./SelectedWork.module.css";

const AUTO_MS = 4200;
const CARD_W = 320;
const CARD_H = 400;

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function lerpFactor(base: number, dt: number) {
  return 1 - Math.exp(-60 * base * Math.max(dt, 0.001));
}

/**
 * Selected work — mirrors mikewilcockdesign.com:
 * - Floating card rests ON the right frame (scaled to fit) → image appears in-frame
 * - On row hover: card lifts toward the cursor (offset +190) with lean; cursor → View
 * - On leave: card eases back into the frame
 */
export function SelectedWork() {
  const { motionPaused, setMotionPaused, reducedMotion, ready, isTouch } =
    useMotion();
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const hoveringRef = useRef(false);

  const lift = useRef({
    v: 0,
    from: 0,
    trail: false,
    t0: 0,
    dur: 600,
    x: 0,
    y: 0,
    shown: false,
  });

  useEffect(() => {
    const id = requestAnimationFrame(() => setPortalReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    hoveringRef.current = hovering;
  }, [hovering]);

  useEffect(() => {
    if (!ready || reducedMotion || motionPaused || hovering) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % projects.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [ready, reducedMotion, motionPaused, hovering]);

  useEffect(() => {
    if (isTouch || reducedMotion) return;

    const unsub = MotionEngine.subscribe((s) => {
      const card = cardRef.current;
      const frame = frameRef.current;
      const section = sectionRef.current;
      if (!card || !frame || !section) return;

      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const secTop = section.getBoundingClientRect().top + scrollY;
      const secH = section.offsetHeight;
      const inView =
        scrollY + vh > secTop - vh * 0.5 && scrollY < secTop + secH;

      if (inView !== lift.current.shown) {
        lift.current.shown = inView;
        card.style.opacity = inView ? "1" : "0";
      }
      if (!inView) return;

      const fr = frame.getBoundingClientRect();
      const frameCX = fr.left + fr.width / 2;
      const frameCY = fr.top + fr.height / 2;
      const scaleRest = fr.width / CARD_W;

      const trail = hoveringRef.current;
      if (trail !== lift.current.trail) {
        lift.current.trail = trail;
        lift.current.from = lift.current.v;
        lift.current.t0 = s.time;
        lift.current.dur = trail ? 0.6 : 0.9;
        if (trail) {
          lift.current.x = s.pointer.x;
          lift.current.y = s.pointer.y;
        }
      }

      const z = Math.min(1, (s.time - lift.current.t0) / lift.current.dur);
      lift.current.v =
        lift.current.from +
        ((trail ? 1 : 0) - lift.current.from) * easeOut(z);

      const prevX = lift.current.x;
      const lf = lerpFactor(0.1, s.dt);
      lift.current.x += (s.pointer.x - lift.current.x) * lf;
      lift.current.y += (s.pointer.y - lift.current.y) * lf;

      // Velocity lean (MW: delta-x / dt * 0.6, clamped)
      const lean = Math.max(
        -12,
        Math.min(12, ((lift.current.x - prevX) / Math.max(s.dt, 0.001)) * 0.6),
      );

      const V = lift.current.v;
      // Rest on frame center; lift toward pointer+190 (image beside View)
      const K = frameCX + (lift.current.x + 190 - frameCX) * V;
      const J = frameCY + (lift.current.y - frameCY) * V;
      const scale = scaleRest + (1 - scaleRest) * V;

      card.style.transform = `translate3d(${(K - CARD_W / 2).toFixed(1)}px, ${(J - CARD_H / 2).toFixed(1)}px, 0) rotate(${(lean * V).toFixed(2)}deg) scale(${scale.toFixed(4)})`;
    });

    return unsub;
  }, [isTouch, reducedMotion]);

  const onEnterList = useCallback(() => setHovering(true), []);
  const onLeaveList = useCallback(() => setHovering(false), []);

  const touchHold = useRef<number | null>(null);

  const selectProject = useCallback(
    (i: number) => {
      setActive(i);
      if (!isTouch) return;
      setHovering(true);
      if (touchHold.current) window.clearTimeout(touchHold.current);
      touchHold.current = window.setTimeout(() => {
        setHovering(false);
        touchHold.current = null;
      }, AUTO_MS);
    },
    [isTouch],
  );

  useEffect(
    () => () => {
      if (touchHold.current) window.clearTimeout(touchHold.current);
    },
    [],
  );

  const card = (
    <div ref={cardRef} className={styles.hoverCard} aria-hidden>
      {projects.map((project, i) => (
        <div
          key={project.id}
          className={`${styles.hoverLayer} ${i === active ? styles.hoverLayerActive : ""}`}
          style={{ background: project.color }}
        >
          <Image
            src={project.cover}
            alt=""
            fill
            sizes="460px"
            className={styles.hoverCardImg}
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      id="work"
      aria-labelledby="work-title"
    >
      <div className={styles.head}>
        <h2 id="work-title" className={styles.title}>
          Selected work ({String(projects.length).padStart(2, "0")})
        </h2>
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.pause}
            onClick={() => setMotionPaused(!motionPaused)}
            data-cursor="outline"
          >
            ({motionPaused ? "Play motion" : "Pause motion"})
          </button>
          <span className="mono">2024 — Present</span>
        </div>
      </div>

      <div className={styles.grid}>
        <div
          className={styles.list}
          onMouseEnter={onEnterList}
          onMouseLeave={onLeaveList}
        >
          {projects.map((project, i) => (
            <a
              key={project.id}
              href={project.href || "#work"}
              target={project.href?.startsWith("http") ? "_blank" : undefined}
              rel={project.href?.startsWith("http") ? "noreferrer" : undefined}
              className={`${styles.item} ${i === active ? styles.itemActive : ""}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => selectProject(i)}
              onPointerDown={() => selectProject(i)}
              data-cursor="View"
            >
              <span className={styles.index}>{project.index}</span>
              <span className={styles.itemTitle}>{project.title}</span>
              <span className={styles.year}>{project.year}</span>
              <div className={styles.meta}>
                <span>{project.kind}</span>
                {project.note ? (
                  <span className={styles.note}>({project.note})</span>
                ) : null}
                <span className={styles.link}>View project →</span>
              </div>
            </a>
          ))}
        </div>

        <div className={styles.stageCol}>
          <div className={styles.stageDock}>
            <div
              ref={frameRef}
              className={styles.stage}
              aria-live="polite"
              data-cursor="View"
            >
              <div className={styles.stageRest}>
                <Image
                  src={projects[active].cover}
                  alt=""
                  fill
                  sizes="460px"
                  className={styles.stageImg}
                />
              </div>
              <span className={styles.big} aria-hidden>
                {projects[active].index}
              </span>
              <div className={styles.stageMobile}>
                {projects.map((project, i) => (
                  <div
                    key={project.id}
                    className={`${styles.stageInner} ${i === active ? styles.stageInnerActive : ""}`}
                    style={{ background: project.color }}
                  >
                    <Image
                      src={project.cover}
                      alt=""
                      fill
                      sizes="(max-width: 900px) 90vw, 460px"
                      priority={i === 0}
                      className={styles.stageImg}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.stageMeta}>
              <span>
                (
                <span className={styles.stageCur}>
                  {projects[active].index}
                </span>{" "}
                / {String(projects.length).padStart(2, "0")})
              </span>
              <span className={styles.stagePlat}>
                {projects[active].platforms || "Web"}
              </span>
            </div>
            <div className={styles.track} aria-hidden>
              <ScrollProgress
                target={sectionRef}
                className={styles.bar}
                smooth={!reducedMotion}
              />
            </div>
          </div>
        </div>
      </div>

      {portalReady && !isTouch && !reducedMotion
        ? createPortal(card, document.body)
        : null}
    </section>
  );
}
