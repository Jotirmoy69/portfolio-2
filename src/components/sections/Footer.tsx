"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { KineticText } from "@/components/motion/KineticText";
import { useContact } from "@/components/contact/ContactContext";
import { smoothScrollTo } from "@/components/motion/smoothScroll";
import styles from "./Footer.module.css";

const COOKIE_KEY = "pc-cookies";

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function Footer() {
  const [showCookie, setShowCookie] = useState(false);
  const [clock, setClock] = useState("00:00");
  const { openContact } = useContact();

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        if (!localStorage.getItem(COOKIE_KEY)) setShowCookie(true);
      } catch {
        setShowCookie(true);
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const tick = () => setClock(formatTime(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const decide = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem(COOKIE_KEY, value);
    } catch {
      /* ignore */
    }
    setShowCookie(false);
  };

  const city = site.location.split(",")[0]?.trim() || site.location;

  return (
    <>
      <footer className={styles.footer} id="contact">
        <div className={styles.label}>Got something in mind?</div>
        <button
          type="button"
          className={styles.big}
          style={{ ["--footer-ems" as string]: "4.6" }}
          data-cursor="Let's go"
          onClick={openContact}
        >
          <KineticText
            className={styles.bigText}
            lines={["Let's talk"]}
            as="span"
            restWidth={70}
            restWeight={800}
            maxWidth={125}
            minWeight={260}
            radius={360}
          />
        </button>
        <div className={styles.row}>
          <a
            href={`mailto:${site.email}`}
            className={styles.email}
            data-cursor="outline"
          >
            {site.email}
          </a>
          <div className={styles.socials}>
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              data-cursor="Open"
            >
              LinkedIn
            </a>
            <a
              href={site.socials.github}
              target="_blank"
              rel="noreferrer"
              data-cursor="Open"
            >
              GitHub
            </a>
          </div>
          <span className={styles.place}>
            {city} <span className={styles.clock}>{clock}</span>
          </span>
          <button
            type="button"
            className={styles.btn}
            onClick={() => setShowCookie(true)}
            data-cursor="outline"
          >
            Cookie settings
          </button>
          <button
            type="button"
            className={styles.top}
            onClick={() => {
              history.pushState(null, "", "#top");
              smoothScrollTo(0);
            }}
            data-cursor="outline"
          >
            Back to top ↑
          </button>
        </div>
      </footer>

      {showCookie ? (
        <div className={styles.cookie} role="dialog" aria-label="Cookies">
          <p className={styles.cookieText}>
            <span className={styles.cookieLabel}>(Cookies)</span>
            I use analytics to see which pages people read. Nothing is tracked
            unless you say yes.
          </p>
          <div className={styles.cookieActions}>
            <button
              type="button"
              className={styles.cookieBtn}
              onClick={() => decide("declined")}
              data-cursor="outline"
            >
              Decline
            </button>
            <button
              type="button"
              className={`${styles.cookieBtn} ${styles.cookieAccept}`}
              onClick={() => decide("accepted")}
              data-cursor="outline"
            >
              Accept
            </button>
            <span className={styles.privacy}>Privacy</span>
          </div>
        </div>
      ) : null}
    </>
  );
}
