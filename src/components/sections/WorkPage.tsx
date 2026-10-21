"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { projects, type Project } from "@/content/site";
import { KineticText } from "@/components/motion/KineticText";
import { ProjectNotice } from "./ProjectNotice";
import styles from "./WorkPage.module.css";

type View = "list" | "grid";

const ease = [0.22, 1, 0.36, 1] as const;

export function WorkPageView() {
  const [view, setView] = useState<View>("list");
  const [notice, setNotice] = useState<Project | null>(null);
  const reduce = Boolean(useReducedMotion());
  const count = String(projects.length).padStart(2, "0");

  const onProjectClick = (e: MouseEvent, project: Project) => {
    if (!project.locked) return;
    e.preventDefault();
    setNotice(project);
  };

  const projectHref = (project: Project) =>
    project.locked ? "#work" : project.href || "#work";

  const externalProps = (project: Project) => {
    const external =
      !project.locked && Boolean(project.href?.startsWith("http"));
    return {
      target: external ? ("_blank" as const) : undefined,
      rel: external ? "noreferrer" : undefined,
    };
  };

  const layoutTransition = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 30, mass: 0.85 };

  return (
    <section className={styles.page}>
      <LayoutGroup id="work-index">
        <div className={styles.head}>
          <h1 className={styles.title}>
            <KineticText
              className={styles.titleKinetic}
              lines={["Work"]}
              as="span"
              restWidth={70}
              restWeight={800}
              maxWidth={118}
              minWeight={300}
              radius={360}
            />
            <sup className={styles.count}>({count})</sup>
          </h1>

          <div className={styles.toggle} role="group" aria-label="View">
            {(["list", "grid"] as const).map((mode) => {
              const active = view === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  className={`${styles.viewBtn} ${active ? styles.viewBtnActive : ""} ${reduce ? styles.viewBtnStatic : ""}`}
                  aria-pressed={active}
                  onClick={() => setView(mode)}
                  data-cursor="outline"
                >
                  {active && !reduce ? (
                    <motion.span
                      layoutId="work-view-pill"
                      className={styles.pill}
                      transition={layoutTransition}
                    />
                  ) : null}
                  <span className={styles.viewLabel}>
                    {mode === "list" ? "List" : "Grid"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.stage}>
          <AnimatePresence mode="wait" initial={false}>
            {view === "list" ? (
              <motion.div
                key="list"
                className={styles.list}
                initial={reduce ? false : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -22 }}
                transition={{ duration: reduce ? 0 : 0.38, ease }}
              >
                <div className={styles.cols} aria-hidden>
                  <span>#</span>
                  <span>Project</span>
                  <span>Type</span>
                  <span>Role</span>
                  <span className={styles.yearHead}>Year</span>
                </div>
                {projects.map((project, i) => (
                  <motion.a
                    key={project.id}
                    href={projectHref(project)}
                    {...externalProps(project)}
                    className={styles.row}
                    data-cursor={project.locked ? "Private" : "View"}
                    onClick={(e) => onProjectClick(e, project)}
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: reduce ? 0 : 0.4,
                      delay: reduce ? 0 : 0.12 + i * 0.045,
                      ease,
                    }}
                  >
                    <span className={styles.num}>{project.index}</span>
                    <span className={styles.name}>{project.title}</span>
                    <span className={styles.detail}>{project.kind}</span>
                    <span className={styles.detail}>
                      {project.role || project.note || ""}
                    </span>
                    <span className={`${styles.num} ${styles.year}`}>
                      {project.year}
                    </span>
                  </motion.a>
                ))}
                <div className={styles.end} aria-hidden />
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                className={styles.grid}
                initial={reduce ? false : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -22 }}
                transition={{ duration: reduce ? 0 : 0.38, ease }}
              >
                {projects.map((project, i) => (
                  <motion.a
                    key={project.id}
                    href={projectHref(project)}
                    {...externalProps(project)}
                    className={styles.card}
                    data-cursor={project.locked ? "Private" : "View"}
                    onClick={(e) => onProjectClick(e, project)}
                    initial={reduce ? false : { opacity: 0, y: 18, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: reduce ? 0 : 0.45,
                      delay: reduce ? 0 : 0.1 + i * 0.05,
                      ease,
                    }}
                  >
                    <div
                      className={styles.cardMedia}
                      style={{ background: project.color }}
                    >
                      <div className={styles.cardLayer}>
                        <Image
                          src={project.cover}
                          alt=""
                          fill
                          sizes="(max-width: 600px) 100vw, 50vw"
                          data-no-squircle
                        />
                      </div>
                    </div>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardName}>{project.title}</span>
                      <span className={styles.cardYear}>{project.year}</span>
                    </div>
                    <div className={styles.cardKind}>{project.kind}</div>
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </LayoutGroup>

      <ProjectNotice
        open={Boolean(notice)}
        title={notice?.lockedTitle || "Under wraps"}
        body={
          notice?.lockedBody ||
          "This project is private and under construction."
        }
        onClose={() => setNotice(null)}
      />
    </section>
  );
}
