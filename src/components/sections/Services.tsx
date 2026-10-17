"use client";

import { services } from "@/content/site";
import { KineticText } from "@/components/motion/KineticText";
import styles from "./Services.module.css";

export function Services() {
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
      <div className={styles.grid}>
        {services.map((service) => (
          <a
            key={service.index}
            href="#contact"
            className={styles.tile}
            data-cursor="Open"
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
        ))}
      </div>
    </section>
  );
}
