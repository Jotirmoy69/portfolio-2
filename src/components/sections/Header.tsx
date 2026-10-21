"use client";

import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const { cycleAccent, ready } = useMotion();
  const { openContact } = useContact();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!ready) return;
    const unsub = MotionEngine.subscribe((s) => {
      const el = logoRef.current;
      if (!el) return;
      el.style.setProperty("--logo-progress", String(s.scrollProgress));
    });
    return unsub;
  }, [ready]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const onLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const now = Date.now();
    clicks.current = [...clicks.current.filter((t) => now - t < 1200), now];
    if (clicks.current.length >= 5) {
      clicks.current = [];
      cycleAccent();
    }
    setMenuOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      history.pushState(null, "", "#top");
      smoothScrollTo(0);
    }
  };

  const openProject = () => {
    setMenuOpen(false);
    openContact();
  };

  const workActive = pathname === "/work" || pathname.startsWith("/work/");
  const aboutActive = pathname === "/about" || pathname.startsWith("/about/");
  const blogActive = pathname === "/blog" || pathname.startsWith("/blog/");
  const servicesActive =
    pathname === "/services" || pathname.startsWith("/services/");

  return (
    <header className={`${styles.header} ${menuOpen ? styles.headerOpen : ""}`}>
      <Link
        ref={logoRef}
        href="/"
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
      </Link>

      <nav className={styles.nav} aria-label="Main">
        <Link
          href="/work"
          data-cursor="Open"
          aria-current={workActive ? "page" : undefined}
          onClick={() => setMenuOpen(false)}
        >
          <span className={styles.dot} aria-hidden />
          Work
        </Link>
        <Link
          href="/about"
          data-cursor="Open"
          aria-current={aboutActive ? "page" : undefined}
          onClick={() => setMenuOpen(false)}
        >
          <span className={styles.dot} aria-hidden />
          About
        </Link>
        <Link
          href="/blog"
          data-cursor="Open"
          aria-current={blogActive ? "page" : undefined}
          onClick={() => setMenuOpen(false)}
        >
          <span className={styles.dot} aria-hidden />
          Blog
        </Link>
        <Link
          href="/services"
          data-cursor="Open"
          aria-current={servicesActive ? "page" : undefined}
          onClick={() => setMenuOpen(false)}
        >
          <span className={styles.dot} aria-hidden />
          Services
        </Link>
        <button
          type="button"
          className={styles.cta}
          data-cursor="Say hi"
          onClick={openProject}
          style={{ filter: SQUIRCLE_FILTER }}
        >
          Start a project
        </button>
      </nav>

      <button
        type="button"
        className={styles.menuBtn}
        aria-expanded={menuOpen}
        aria-controls={menuId}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span className={styles.menuIcon} aria-hidden>
          <span />
          <span />
        </span>
      </button>

      <div
        id={menuId}
        className={styles.sheet}
        data-open={menuOpen ? "true" : "false"}
        aria-hidden={!menuOpen}
        inert={!menuOpen ? true : undefined}
      >
        <nav className={styles.sheetNav} aria-label="Mobile">
          <button
            type="button"
            className={styles.sheetClose}
            onClick={() => setMenuOpen(false)}
          >
            Close
          </button>
          <Link
            href="/work"
            aria-current={workActive ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            Work
          </Link>
          <Link
            href="/about"
            aria-current={aboutActive ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/blog"
            aria-current={blogActive ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/services"
            aria-current={servicesActive ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            Services
          </Link>
          <button type="button" className={styles.sheetCta} onClick={openProject}>
            Start a project
          </button>
        </nav>
      </div>
    </header>
  );
}
