"use client";

import { site } from "@/content/site";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-based-velocity";
import styles from "./Marquee.module.css";

function SkillStrip() {
  return (
    <>
      {site.skills.map((skill) => (
        <span key={skill} className={styles.item}>
          {skill}
          <span className={styles.diamond} aria-hidden />
        </span>
      ))}
    </>
  );
}

export function Marquee() {
  return (
    <div className={styles.wrap} aria-hidden>
      <ScrollVelocityContainer className={styles.container}>
        <ScrollVelocityRow
          baseVelocity={3}
          direction={1}
          className={styles.row}
        >
          <SkillStrip />
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
    </div>
  );
}
