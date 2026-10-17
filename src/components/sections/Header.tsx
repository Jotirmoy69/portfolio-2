"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { site } from "@/content/site";
import { MotionEngine } from "@/components/motion/MotionEngine";
import { useMotion } from "@/components/motion/MotionContext";
import { useContact } from "@/components/contact/ContactContext";
import { smoothScrollTo } from "@/components/motion/smoothScroll";
import { SQUIRCLE_FILTER } from "@/components/ui/skiper63";
import styles from "./Header.module.css";

export function Header() {
  const logoRef = useRef<HTMLAnchorElement>(null);
  const clicks = useRef<number[]>([]);
  const { cycleAccent, ready } = useMotion();
  const { openContact } = useContact();

  useEffect(() => {
    if (!ready) return;
    const unsub = MotionEngine.subscribe((s) => {
      const el = logoRef.current;
      if (!el) return;
      el.style.setProperty("--logo-progress", String(s.scrollProgress));
    });
    return unsub;
  }, [ready]);

  const onLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const now = Date.now();
    clicks.current = [...clicks.current.filter((t) => now - t < 1200), now];
    if (clicks.current.length >= 5) {
      clicks.current = [];
      cycleAccent();
    }
    history.pushState(null, "", "#top");
    smoothScrollTo(0);
  };

  const onNavClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const href = e.currentTarget.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    history.pushState(null, "", href);
    if (href === "#top") {
      smoothScrollTo(0);
      return;
    }
    const target = document.querySelector(href);
    if (target) smoothScrollTo(target);
  };

  return (
    <header className={styles.header}>
      <a
        ref={logoRef}
        href="#top"
        className={styles.logo}
        onClick={onLogoClick}
        data-cursor="Home"
        aria-label={`${site.name}, home`}
      >
        <span className={styles.logoFirst} aria-hidden>
          {site.lockup.first}
        </span>
        <span className={styles.logoW} data-logo-w="" aria-hidden>
          <span className={styles.logoFill} data-logo-fill="" />
          <span className={styles.logoLetter}>{site.lockup.box}</span>
        </span>
        <span className={styles.logoRest} aria-hidden>
          {site.lockup.rest}
        </span>
      </a>
      <nav className={styles.nav} aria-label="Main">
        <a href="#work" data-cursor="Open" onClick={onNavClick}>
          <span className={styles.dot} aria-hidden />
          Work
        </a>
        <a href="#about" data-cursor="Open" onClick={onNavClick}>
          <span className={styles.dot} aria-hidden />
          About
        </a>
        <a href="#services" data-cursor="Open" onClick={onNavClick}>
          <span className={styles.dot} aria-hidden />
          Services
        </a>
        <button
          type="button"
          className={styles.cta}
          data-cursor="Say hi"
          onClick={openContact}
          style={{ filter: SQUIRCLE_FILTER }}
        >
          Start a project
        </button>
      </nav>
    </header>
  );
}
