"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { useMotion } from "./MotionContext";
import styles from "./Preloader.module.css";

const EASE_Y = "cubic-bezier(.16,1,.3,1)";
const EASE_G = "cubic-bezier(.76,0,.24,1)";
const EASE_LAND = "cubic-bezier(.83,0,.17,1)";

/** Prevent React Strict Mode from cancelling a mid-flight intro */
let introLock = false;

/**
 * Survives client-side route changes (layout stays mounted) but resets on
 * full document reload — so soft navigations skip the intro.
 */
let introPlayedThisDocument = false;

type Anim = Animation;

function play(
  el: Element,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
  getRate: () => number,
) {
  const anim = el.animate(keyframes, options);
  anim.playbackRate = getRate();
  return anim;
}

export function Preloader() {
  const { reducedMotion, setReady } = useMotion();
  // Visible on first paint of a full load; skipped after it has played once
  // in this document (covers remounts during client navigations).
  const [show, setShow] = useState(() => !introPlayedThisDocument);
  const [armed, setArmed] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLSpanElement>(null);
  const boxLetterRef = useRef<HTMLSpanElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (reducedMotion || introPlayedThisDocument) {
        introPlayedThisDocument = true;
        setShow(false);
        setReady(true);
        return;
      }
      setShow(true);
      setArmed(true);
    });
    return () => cancelAnimationFrame(id);
  }, [reducedMotion, setReady]);

  useEffect(() => {
    if (!show || !armed) return;
    if (introLock) return;
    introLock = true;

    const root = rootRef.current;
    const bg = bgRef.current;
    const box = boxRef.current;
    const boxLetter = boxLetterRef.current;
    const meta = metaRef.current;
    const countEl = countRef.current;
    const line = lineRef.current;
    if (!root || !bg || !box || !boxLetter || !meta || !countEl || !line) {
      introLock = false;
      return;
    }

    const html = document.documentElement;
    let introRate = 1;
    let stopped = false;
    let rafId = 0;
    const getRate = () => introRate;

    html.dataset.intro = "playing";
    html.style.overflow = "hidden";
    document.body.classList.add("is-loading");

    const syncRates = () => {
      root.getAnimations({ subtree: true }).forEach((a) => {
        a.updatePlaybackRate(introRate);
      });
    };

    const speedUp = () => {
      if (introRate !== 1 || stopped) return;
      introRate = 4;
      syncRates();
      delete root.dataset.cursor;
      delete root.dataset.cursorLabel;
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") speedUp();
    };

    // Delay skip arming so focus/automation clicks don't 4× the intro
    let skipArmed = false;
    const armTimer = window.setTimeout(() => {
      skipArmed = true;
    }, 900);

    const onClick = (e: MouseEvent) => {
      if (skipArmed && e.isTrusted) speedUp();
    };

    root.dataset.cursor = "hover";
    root.dataset.cursorLabel = "Skip";
    root.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);

    const teardown = () => {
      window.clearTimeout(armTimer);
      root.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
      delete root.dataset.cursor;
      delete root.dataset.cursorLabel;
      delete root.dataset.cursorTone;
    };

    const letters = [...root.querySelectorAll<HTMLElement>("[data-il]")];

    // —— Phase 1: letters rise + box pop + meta ——
    letters.forEach((letter, i) => {
      const finalFvs =
        letter.dataset.il === "italic"
          ? "'wdth' 110, 'wght' 250"
          : "'wdth' 68, 'wght' 850";

      play(
        letter,
        [{ transform: "translateY(115%)" }, { transform: "none" }],
        { duration: 650, delay: 80 + 30 * i, easing: EASE_Y, fill: "both" },
        getRate,
      );

      play(
        letter,
        [
          { fontVariationSettings: "'wdth' 125, 'wght' 150" },
          {
            fontVariationSettings: "'wdth' 62, 'wght' 900",
            offset: 0.45,
          },
          { fontVariationSettings: finalFvs },
        ],
        {
          duration: 750,
          delay: 100 + 22 * i,
          easing: "ease-in-out",
          fill: "both",
        },
        getRate,
      );
    });

    play(
      box,
      [{ transform: "scale(0) rotate(-90deg)" }, { transform: "none" }],
      { duration: 650, delay: 220, easing: EASE_Y, fill: "forwards" },
      getRate,
    );

    play(
      meta,
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 400, delay: 140, fill: "both" },
      getRate,
    );

    // —— Phase 2: counter + line (~1120ms clock) ——
    let elapsed = 0;
    let last = performance.now();

    const finishIntro = () => {
      if (stopped) return;
      stopped = true;
      introPlayedThisDocument = true;
      teardown();
      delete html.dataset.intro;
      html.style.overflow = "";
      document.body.classList.remove("is-loading");
      root.getAnimations({ subtree: true }).forEach((a) => a.cancel());
      introLock = false;
      setShow(false);
    };

    const landOnLogo = (scale: number, naturalW: number) => {
      if (stopped) return;

      bg.style.opacity = "0";
      html.style.overflow = "";
      document.body.classList.remove("is-loading");
      setReady(true);

      const target =
        document.querySelector("[data-logo-w]")?.getBoundingClientRect() ??
        new DOMRect(20, 20, 16, 19);

      const ox = box.offsetLeft + box.offsetWidth / 2;
      const oy = box.offsetTop + box.offsetHeight / 2;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const from = `translate(${vw / 2 - ox}px, ${vh / 2 - oy}px) scale(${scale})`;
      const to = `translate(${target.left + target.width / 2 - ox}px, ${target.top + target.height / 2 - oy}px) scale(${target.width / Math.max(naturalW, 1)})`;

      const main = document.querySelector("main");
      if (main) {
        play(
          main,
          [
            { transform: "scale(1.06)", opacity: 0.4 },
            { transform: "none", opacity: 1 },
          ],
          { duration: 1100, easing: EASE_Y },
          getRate,
        );
      }

      play(
        boxLetter,
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 250, delay: 480, fill: "forwards" },
        getRate,
      );

      const land: Anim = play(
        box,
        [{ transform: from }, { transform: to }],
        { duration: 750, easing: EASE_LAND, fill: "forwards" },
        getRate,
      );

      land.onfinish = () => finishIntro();
    };

    const expandBox = () => {
      if (stopped) return;

      letters.forEach((letter, i) => {
        play(
          letter,
          [{ transform: "none" }, { transform: "translateY(-115%)" }],
          {
            duration: 480,
            delay: 16 * i,
            easing: EASE_G,
            fill: "forwards",
          },
          getRate,
        );
      });

      play(
        meta,
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 250, fill: "forwards" },
        getRate,
      );
      play(
        line,
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 250, fill: "forwards" },
        getRate,
      );
      play(
        boxLetter,
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 200, delay: 200, fill: "forwards" },
        getRate,
      );

      root.dataset.cursorTone = "dark";

      const boxRect = box.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scale =
        1.15 *
        Math.max(
          vw / Math.max(boxRect.width, 1),
          vh / Math.max(boxRect.height, 1),
        );
      const toCenter = `translate(${vw / 2 - (boxRect.left + boxRect.width / 2)}px, ${vh / 2 - (boxRect.top + boxRect.height / 2)}px) scale(${scale})`;

      const expand: Anim = play(
        box,
        [{ transform: "none" }, { transform: toCenter }],
        {
          duration: 650,
          delay: 160,
          easing: EASE_G,
          fill: "forwards",
        },
        getRate,
      );

      expand.onfinish = () => landOnLogo(scale, boxRect.width);
    };

    const tick = (now: number) => {
      if (stopped) return;
      elapsed += Math.max(0, now - last) * introRate;
      last = now;
      const t = 1 - Math.pow(1 - Math.min(1, elapsed / 1000), 3);
      countEl.textContent = String(Math.round(100 * t)).padStart(3, "0");
      line.style.transform = `scaleX(${t.toFixed(4)})`;
      if (elapsed >= 1120) {
        expandBox();
        return;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // Intentionally no cancel on cleanup — Strict Mode would kill the intro mid-flight.
    // finishIntro() releases introLock when the sequence completes.
    return () => {
      void rafId;
      teardown();
    };
  }, [show, armed, setReady]);

  if (!show) return null;

  const { first, box: boxChar, rest } = site.lockup;

  return (
    <div
      ref={rootRef}
      className={styles.root}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div ref={bgRef} className={styles.bg} aria-hidden />
      <div className={styles.lockup}>
        <div className={styles.logo} aria-hidden>
          <span className={`${styles.clip} ${styles.clipFirst}`}>
            {[...first].map((ch, i) => (
              <span key={`f-${i}`} className={styles.letter} data-il="">
                {ch}
              </span>
            ))}
          </span>
          <span ref={boxRef} className={styles.box} data-ibox="">
            <span ref={boxLetterRef} className={styles.boxLetter} data-iw="">
              {boxChar}
            </span>
          </span>
          <span className={`${styles.clip} ${styles.clipRest}`}>
            {[...rest].map((ch, i) => (
              <span
                key={`r-${i}`}
                className={`${styles.letter} ${styles.letterItalic}`}
                data-il="italic"
              >
                {ch}
              </span>
            ))}
          </span>
        </div>
      </div>
      <div ref={metaRef} className={styles.meta} data-imeta="">
        <div className={styles.role}>
          <span>{site.role}</span>
          <span>{site.location}</span>
        </div>
        <span ref={countRef} className={styles.count} data-icount="">
          000
        </span>
      </div>
      <div ref={lineRef} className={styles.line} data-iline="" aria-hidden />
    </div>
  );
}
