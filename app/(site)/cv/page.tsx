import type { Metadata } from "next";
import { site } from "@/content/site";
import s from "@/styles/shared.module.css";
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
    when: "2024 — Present",
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
        {site.resumes.length > 0 ? (
          <div className={styles.downloads}>
            {site.resumes.map((resume) => (
              <a
                key={resume.lang}
                href={resume.href}
                download={resume.filename}
                lang={resume.lang}
                aria-label={resume.aria}
                className={styles.download}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resume.icon} alt="" width={38} height={38} />
                <span>{resume.label}</span>
              </a>
            ))}
          </div>
        ) : null}
      </div>
      <p className={s.lead}>
        Mechanical Engineering undergraduate at KAIST — robotics, autonomous systems, and
        learning-based UAV navigation.
      </p>
      <p className={styles.location}>{site.location}</p>

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
              <span className={s.rowSub}>Field AI & Robotics Lab (FAIR Lab) · KAIST · Undergraduate research intern</span>
            </span>
          </div>
          <div className={s.row}>
            <span className={s.rowDate}>2025.09 — 2026.01</span>
            <span className={s.rowBody}>
              <b>BOLT</b> — Modifying the open-source biped robot BOLT and building its control system for
              walking stabilization and real-time torque control (ROS 2)
              <span className={s.rowSub}>Dynamic Robot Control & Design Lab (DRCD) · KAIST · Undergraduate research intern</span>
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
