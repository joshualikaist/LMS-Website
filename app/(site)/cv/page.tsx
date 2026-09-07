import type { Metadata } from "next";
import { site } from "@/content/site";
import s from "@/styles/shared.module.css";
import raised from "@/styles/raised.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "CV",
  description: "Curriculum vitae — Minseok Li, Mechanical Engineering, KAIST.",
};

type TimelineItem = {
  when: string;
  title: string;
  place: string;
  note?: string;
};

const education: TimelineItem[] = [
  {
    when: "2024 — 2028",
    title: "B.S. in Mechanical Engineering",
    place: "KAIST",
  },
  {
    when: "2021 — 2024",
    title: "Hansung Science High School",
    place: "Seoul",
  },
];

const experience: TimelineItem[] = [
  {
    when: "2026.03 — Present",
    title: "Undergraduate Student Researcher",
    place: "Field AI & Robotics Lab, KAIST",
    note: "UAV navigation · robot learning · autonomous systems",
  },
  {
    when: "2025.09 — 2026.01",
    title: "Undergraduate Student Researcher",
    place: "Dynamic Robot Control & Design Lab, KAIST",
  },
  {
    when: "2025.06 — 2025.08",
    title: "Marketing Communication Intern",
    place: "Welaaa",
  },
];

function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className={styles.timeline}>
      {items.map((item) => (
        <li key={`${item.when}-${item.title}-${item.place}`} className={styles.item}>
          <p className={styles.when}>{item.when}</p>
          <p className={styles.itemTitle}>{item.title}</p>
          <p className={styles.place}>{item.place}</p>
          {item.note ? <p className={styles.note}>{item.note}</p> : null}
        </li>
      ))}
    </ol>
  );
}

export default function CvPage() {
  return (
    <main className={`page ${styles.main}`}>
      <div className={styles.head}>
        <h1 className={s.h1}>Minseok Li</h1>
        {site.cvPdf ? (
          <a href={site.cvPdf} target="_blank" rel="noreferrer" className={raised.btn}>
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
        <a href={site.github} target="_blank" rel="noreferrer" className={raised.btn}>
          GitHub — {site.githubHandle}
        </a>
        {site.email ? (
          <a href={`mailto:${site.email}`} className={raised.btn}>
            {site.email}
          </a>
        ) : (
          <span>[YOUR EMAIL]</span>
        )}
        {site.linkedin ? (
          <a href={site.linkedin} target="_blank" rel="noreferrer" className={raised.btn}>
            LinkedIn
          </a>
        ) : null}
        {site.instagram ? (
          <a href={site.instagram} target="_blank" rel="noreferrer" className={raised.btn}>
            Instagram
          </a>
        ) : null}
      </div>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>Education</h2>
        <Timeline items={education} />
      </section>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>Experience</h2>
        <Timeline items={experience} />
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
