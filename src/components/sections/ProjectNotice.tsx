"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./ProjectNotice.module.css";

type Props = {
  open: boolean;
  title: string;
  body: string;
  onClose: () => void;
};

export function ProjectNotice({ open, title, body, onClose }: Props) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className={styles.root} role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close"
        onClick={onClose}
      />
      <div className={styles.panel}>
        <div className={styles.head}>
          <p className={styles.eyebrow}>(Private)</p>
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <p className={styles.body}>{body}</p>
        <p className={styles.aside}>Not open source · Under construction</p>
      </div>
    </div>,
    document.body,
  );
}
