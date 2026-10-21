"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { site } from "@/content/site";
import { useContact } from "./ContactContext";
import styles from "./ContactModal.module.css";

type Channel = {
  label: string;
  value: string;
  href: string;
  external?: boolean;
};

function buildChannels(): Channel[] {
  const list: Channel[] = [
    {
      label: "Email",
      value: site.email,
      href: `mailto:${site.email}`,
    },
  ];

  if (site.phone) {
    list.push({
      label: "Phone",
      value: site.phone,
      href: `tel:${site.phone.replace(/\s+/g, "")}`,
    });
  }

  list.push({
    label: "LinkedIn",
    value: "jotirmoy-bhowmik",
    href: site.socials.linkedin,
    external: true,
  });

  list.push({
    label: "GitHub",
    value: "Jotirmoy69",
    href: site.socials.github,
    external: true,
  });

  if (site.socials.instagram) {
    list.push({
      label: "Instagram",
      value: site.socials.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, ""),
      href: site.socials.instagram,
      external: true,
    });
  }

  return list;
}

export function ContactModal() {
  const { open, closeContact } = useContact();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const channels = buildChannels();

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeContact();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeContact]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className={styles.root} role="presentation">
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close contact"
        onClick={closeContact}
        data-cursor="outline"
      />
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.head}>
          <p className={styles.eyebrow}>(Contact)</p>
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            onClick={closeContact}
            data-cursor="outline"
            aria-label="Close"
          >
            Close
          </button>
        </div>

        <h2 id={titleId} className={styles.title}>
          Let’s talk
        </h2>
        <p className={styles.sub}>
          Pick a channel. I’ll get back as soon as I can.
        </p>

        <ul className={styles.list}>
          {channels.map((ch) => (
            <li key={ch.label}>
              <a
                href={ch.href}
                className={styles.row}
                data-cursor={ch.external ? "Open" : "Say hi"}
                {...(ch.external
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
                <span className={styles.label}>{ch.label}</span>
                <span className={styles.value}>{ch.value}</span>
                <span className={styles.arrow} aria-hidden>
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className={styles.place}>
          {site.location}
          {site.role ? ` · ${site.role}` : null}
        </p>
      </div>
    </div>,
    document.body,
  );
}
