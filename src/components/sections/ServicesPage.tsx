"use client";

import { services, servicesPage } from "@/content/site";
import { KineticText } from "@/components/motion/KineticText";
import { useContact } from "@/components/contact/ContactContext";
import styles from "./ServicesPage.module.css";

export function ServicesPageView() {
  const { openContact } = useContact();
  const { intro, stepsLabel, steps, plansLabel, plans } = servicesPage;

  return (
    <article className={styles.page}>
      <div className={styles.titleSection}>
        <KineticText
          className={styles.title}
          lines={["Services"]}
          as="h1"
          restWidth={70}
          restWeight={800}
          maxWidth={118}
          minWeight={300}
          radius={340}
        />
        <p className={styles.intro}>{intro}</p>
      </div>

      <div className={styles.list}>
        <div className={styles.rows}>
          {services.map((service) => (
            <button
              key={service.index}
              type="button"
              className={styles.row}
              data-cursor="Open"
              onClick={openContact}
            >
              <div className={styles.heading}>
                <span className={styles.number}>{service.index}</span>
                <span className={styles.rowTitle}>{service.title}</span>
              </div>
              <p className={styles.description}>{service.body}</p>
              <div className={styles.tags}>
                {service.tags.map((tag) => (
                  <span key={tag} className={styles.chip}>
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      <section className={styles.steps} aria-labelledby="steps-label">
        <div id="steps-label" className={styles.eyebrow}>
          {stepsLabel}
        </div>
        <div className={styles.stepsGrid}>
          {steps.map((step) => (
            <div key={step.title} className={styles.step}>
              <div className={styles.stepTitle}>{step.title}</div>
              <p className={styles.stepBody}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.plans} aria-labelledby="plans-label">
        <div id="plans-label" className={styles.eyebrow}>
          {plansLabel}
        </div>
        <div className={styles.plansGrid}>
          {plans.map((plan) => (
            <button
              key={plan.title}
              type="button"
              className={styles.planCard}
              data-cursor="Enquire"
              onClick={openContact}
            >
              <div className={styles.planTitle}>{plan.title}</div>
              <p className={styles.planBody}>{plan.body}</p>
              <div className={styles.planPrice}>{plan.price}</div>
            </button>
          ))}
        </div>
      </section>
    </article>
  );
}
