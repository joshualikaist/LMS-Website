import type { Metadata } from "next";
import Link from "next/link";
import s from "@/styles/shared.module.css";
import raised from "@/styles/raised.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Research",
  description: "Research — MOTAR, sensor-only UAV interception of moving targets at KAIST.",
};

type Project = {
  name: string;
  href: string;
  summary: string;
  meta: string;
  ongoing: boolean;
  links: { label: string; href: string; external?: boolean }[];
};

// Newest first. Add a project here and it shows up on the page.
const PROJECTS: Project[] = [
  {
    name: "MOTAR",
    href: "/work/motar",
    summary:
      "Teaching a drone to intercept a moving target in clutter with nothing but its own camera and LiDAR — a learned policy trained in simulation, kept flyable by a flight controller.",
    meta: "2026 · FAIR Lab, KAIST",
    ongoing: true,
    links: [
      { label: "Case study", href: "/work/motar" },
      { label: "Technical notes", href: "/research/motar" },
      { label: "Status", href: "https://joshualikaist.github.io/MOTAR/status/", external: true },
    ],
  },
];

export default function ResearchPage() {
  return (
    <main className={`page ${styles.main}`}>
      <h1 className={s.h1}>Research</h1>
      <p className={s.lead}>
        Robotics and autonomous systems research at KAIST.
      </p>
      <div className={styles.list}>
        {PROJECTS.map((p) => (
          <article key={p.name} className={styles.item}>
            <div className={styles.head}>
              <Link href={p.href} className={styles.name}>
                {p.name}
              </Link>
              {p.ongoing ? (
                <span className={s.statusChip}>
                  <span className={s.dotSignal} />
                  ONGOING
                </span>
              ) : null}
            </div>
            <p className={s.entryDesc}>{p.summary}</p>
            <div className={s.entryMeta}>{p.meta}</div>
            <div className={s.entryLinks}>
              {p.links.map((l) =>
                l.external ? (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={raised.btn}>
                    {l.label} ↗
                  </a>
                ) : (
                  <Link key={l.href} href={l.href} className={raised.btn}>
                    {l.label} →
                  </Link>
                ),
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
