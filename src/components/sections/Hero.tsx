"use client";

import type { MouseEvent } from "react";
import { site } from "@/content/site";
import { KineticText } from "@/components/motion/KineticText";
import { Magnetic } from "@/components/motion/Magnetic";
import { smoothScrollTo } from "@/components/motion/smoothScroll";
import { SQUIRCLE_FILTER } from "@/components/ui/skiper63";
import styles from "./Hero.module.css";

export function Hero() {
  const onSeeWork = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    history.pushState(null, "", "#work");
    const target = document.getElementById("work");
    if (target) smoothScrollTo(target);
  };

  return (
    <section className={styles.hero} id="top" aria-label="Intro">
      <div className={styles.meta}>
        <span>(Portfolio / ©{site.year})</span>
        <span className={styles.metaCentre}>{site.role}</span>
        <span>{site.location}</span>
      </div>

      <div className={styles.titleWrap}>
        <KineticText
          className={styles.title}
          lines={[site.hero.line1, site.hero.line2]}
          as="h1"
        />
      </div>

      <div className={styles.bottom}>
        <p className={styles.intro}>{site.hero.intro}</p>
        <p className={styles.scroll}>{site.hero.scrollHint}</p>
        <div className={styles.ctaRow}>
          <Magnetic>
            <a
              href="#work"
              className={styles.cta}
              data-cursor="Look"
              onClick={onSeeWork}
              style={{ filter: SQUIRCLE_FILTER }}
            >
              See the work →
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
