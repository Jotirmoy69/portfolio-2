"use client";

import { site } from "@/content/site";
import styles from "./Marquee.module.css";

export function Marquee() {
  const items = [...site.skills, ...site.skills];

  return (
    <div className={styles.wrap} aria-hidden>
      <div className={styles.track}>
        {items.map((skill, i) => (
          <span key={`${skill}-${i}`} className={styles.item}>
            {skill}
            <span className={styles.diamond} />
          </span>
        ))}
      </div>
    </div>
  );
}
