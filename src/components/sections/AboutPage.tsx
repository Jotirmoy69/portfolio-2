"use client";

import Image from "next/image";
import { site } from "@/content/site";
import { KineticText } from "@/components/motion/KineticText";
import { Highlighter } from "@/components/ui/highlighter";
import styles from "./AboutPage.module.css";

export function AboutPageView() {
  const { about } = site;

  const lead = (
    <>
      Hi, I&apos;m Jotirmoy. I&apos;m a full-stack developer and founder-minded
      builder based in Rajshahi, Bangladesh, co-founder of{" "}
      <Highlighter
        action="underline"
        color="#7FA8FF"
        isView
        iterations={2}
        animationDuration={800}
        strokeWidth={2}
        padding={2}
      >
        <a
          href="https://hylith.com"
          className={styles.inlineLink}
          target="_blank"
          rel="noreferrer"
          data-cursor="Open"
        >
          Hylith
        </a>
      </Highlighter>
      .
    </>
  );

  return (
    <article className={styles.page}>
      <div className={styles.titleSection}>
        <KineticText
          className={styles.title}
          lines={[about.title]}
          as="h1"
          restWidth={70}
          restWeight={800}
          maxWidth={118}
          minWeight={300}
          radius={360}
        />
      </div>

      <section className={styles.columns}>
        <div className={styles.grid}>
          <div className={styles.media}>
            <div className={styles.frame}>
              <Image
                src={about.image}
                alt={about.imageAlt}
                fill
                priority
                sizes="(max-width: 700px) 100vw, 50vw"
                data-no-squircle
              />
            </div>
          </div>

          <div className={styles.content}>
            <p className={styles.lead}>{lead}</p>

            <div className={styles.body}>
              {about.paragraphs.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>

            <section className={styles.toolkit} aria-labelledby="toolkit-title">
              <h2 id="toolkit-title" className={styles.toolkitLabel}>
                {about.toolkitLabel}
              </h2>
              <ul className={styles.toolkitList}>
                {about.toolkit.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </section>
    </article>
  );
}
