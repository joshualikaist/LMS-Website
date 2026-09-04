import type { Metadata } from "next";
import { site } from "@/content/site";
import s from "@/styles/shared.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "CV",
  description: "Curriculum vitae — Minseok Li, Mechanical Engineering, KAIST.",
};

export default function CvPage() {
  return (
    <main className={`page ${styles.main}`}>
      <div className={styles.head}>
        <h1 className={s.h1}>Minseok Li</h1>
        {site.cvPdf ? (
          <a href={site.cvPdf} target="_blank" rel="noreferrer" className={styles.pdf}>
            Download PDF ↗
          </a>
        ) : (
          <span className={`${s.mono11m} ${styles.pdf}`}>PDF — [ADD FILE UNDER public/cv/]</span>
        )}
      </div>
      <p className={s.lead}>
        Mechanical Engineering undergraduate at KAIST — robotics, autonomous systems, and
        learning-based UAV navigation.
      </p>
      <div className={styles.contactLine}>
        <span>{site.location}</span>
        <a href={site.github} target="_blank" rel="noreferrer">
          GitHub — {site.githubHandle}
        </a>
        {site.email ? <a href={`mailto:${site.email}`}>{site.email}</a> : <span>[YOUR EMAIL]</span>}
        {site.linkedin ? (
          <a href={site.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        ) : null}
        {site.instagram ? (
          <a href={site.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
        ) : null}
      </div>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>Education</h2>
        <div className={styles.rows}>
          <div className={s.row}>
            <span className={s.rowDate}>2024 — 2028</span>
            <span className={s.rowBody}>
              <b>KAIST</b> — B.S. in Mechanical Engineering
              <span className={s.rowSub}>Korea Advanced Institute of Science and Technology</span>
            </span>
          </div>
          <div className={s.row}>
            <span className={s.rowDate}>2021 — 2024</span>
            <span className={s.rowBody}>
              <b>Hansung Science High School</b>
            </span>
          </div>
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>Experience</h2>
        <div className={styles.rows}>
          <div className={s.row}>
            <span className={s.rowDate}>2026.03 — Present</span>
            <span className={s.rowBody}>
              <b>Field AI &amp; Robotics Lab, KAIST</b> — Undergraduate Student Researcher
              <span className={s.rowSub}>UAV navigation · robot learning · autonomous systems</span>
            </span>
          </div>
          <div className={s.row}>
            <span className={s.rowDate}>2025.09 — 2026.01</span>
            <span className={s.rowBody}>
              <b>Dynamic Robot Control &amp; Design Lab, KAIST</b> — Undergraduate Student Researcher
            </span>
          </div>
          <div className={s.row}>
            <span className={s.rowDate}>2025.06 — 2025.08</span>
            <span className={s.rowBody}>
              <b>Welaaa</b> — Marketing Communication Intern
            </span>
          </div>
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>Projects</h2>
        <div className={styles.rows}>
          <div className={s.row}>
            <span className={s.rowDate}>2026 — Ongoing</span>
            <span className={s.rowBody}>
              <b>MOTAR</b> — Sensor-only UAV interception of moving targets
              <span className={s.rowSub}>FAIR Lab · KAIST</span>
            </span>
          </div>
          <div className={s.row}>
            <span className={s.rowDate}>2026</span>
            <span className={s.rowBody}>
              <b>MESC Website</b> — A single digital hub for KAIST Mechanical Engineering students
              <span className={s.rowSub}>Full-stack web development</span>
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
