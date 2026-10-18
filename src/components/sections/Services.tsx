"use client";

import { useEffect, useRef, useState } from "react";
import { services } from "@/content/site";
import { KineticText } from "@/components/motion/KineticText";
import { useMotion } from "@/components/motion/MotionContext";
import styles from "./Services.module.css";

export function Services() {
  const { isTouch, reducedMotion } = useMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const [featured, setFeatured] = useState(0);
  const [pressed, setPressed] = useState<number | null>(null);

  useEffect(() => {
    if (!isTouch || reducedMotion) return;
    const grid = gridRef.current;
    if (!grid) return;

    const tiles = [...grid.querySelectorAll<HTMLElement>("[data-service]")];
    if (tiles.length === 0) return;

    const pick = () => {
      const mid = window.innerHeight * 0.45;
      let best = 0;
      let bestDist = Infinity;
      tiles.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const cy = r.top + r.height / 2;
        const dist = Math.abs(cy - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setFeatured(best);
    };

    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, [isTouch, reducedMotion]);

  return (
    <section
      className={styles.section}
      id="services"
      aria-labelledby="services-title"
    >
      <div className={styles.head}>
        <h2 id="services-title" className={styles.title}>
          What I do
        </h2>
        <a href="#contact" className={styles.all} data-cursor="Open">
          All services →
        </a>
      </div>
      <div ref={gridRef} className={styles.grid}>
        {services.map((service, i) => {
          const lit =
            pressed === i || (isTouch && !reducedMotion && featured === i);
          return (
            <a
              key={service.index}
              href="#contact"
              data-service
              className={`${styles.tile} ${lit ? styles.tileLit : ""}`}
              data-cursor="Open"
              onPointerDown={() => setPressed(i)}
              onPointerUp={() => setPressed(null)}
              onPointerLeave={() => setPressed(null)}
              onPointerCancel={() => setPressed(null)}
            >
              <span className={styles.fill} aria-hidden />
              <div className={styles.content}>
                <div className={styles.header}>
                  <span>{service.index}</span>
                  <span className={styles.arrow} aria-hidden>
                    →
                  </span>
                </div>
                <KineticText
                  className={styles.tileTitle}
                  lines={[service.title]}
                  as="h3"
                  restWidth={72}
                  restWeight={650}
                  maxWidth={118}
                  minWeight={500}
                  radius={280}
                />
                <p className={styles.body}>{service.body}</p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
