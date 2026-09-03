import type { Metadata } from "next";
import Link from "next/link";
import { ArenaPlaceholder } from "@/components/media/Placeholders";
import { site } from "@/content/site";
import s from "@/styles/shared.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "MOTAR",
  description:
    "Teaching a drone to intercept a moving target — with nothing but its own sensors. A research case study.",
  openGraph: {
    title: "MOTAR — Minseok Li",
    description:
      "Teaching a drone to intercept a moving target with onboard sensors. A research case study.",
    type: "article",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "MOTAR — Minseok Li",
    description: "Sensor-only UAV interception of moving targets in cluttered environments.",
    images: [],
  },
};

const PROBLEMS = [
  {
    id: "P-01",
    label: "THE TARGET HIDES",
    body: "Every time the drone swerves around an obstacle, it loses sight of the target — and has to keep flying on memory.",
  },
  {
    id: "P-02",
    label: "THE GOAL MOVES",
    body: "There is no fixed destination. The point to reach is somewhere the target will be — not where it is now.",
  },
  {
    id: "P-03",
    label: "THE SPACE IS CROWDED",
    body: "In a dense obstacle field, the safe path and the intercepting path are rarely the same path.",
  },
];

const APPROACH = [
  {
    id: "A-01",
    label: "SEE",
    body: "A camera and LiDAR give the drone its own view of the scene — no external tracking, no prebuilt map.",
  },
  {
    id: "A-02",
    label: "DECIDE",
    body: "A learned policy turns that view into the next maneuver, trained in simulation across millions of attempts.",
  },
  {
    id: "A-03",
    label: "FLY",
    body: "A flight controller keeps every maneuver within what the aircraft can physically do.",
  },
];

export default function MotarPage() {
  return (
    <main className={`page ${styles.main}`}>
      <div className={s.kicker}>WORK / MOTAR</div>
      <h1 className={`${s.h1} ${styles.title}`}>MOTAR</h1>
      <p className={s.lead}>
        Teaching a drone to intercept a moving target — with nothing but its own sensors.
      </p>
      <div className={`${s.metaRow} ${styles.meta}`}>
        <span className={s.mono12m}>2026 — ONGOING</span>
        <span className={s.mono12m}>FAIR LAB · KAIST</span>
        <span className={s.statusChip}>
          <span className={s.dotSignal} />
          SIMULATION ACTIVE
        </span>
      </div>
      <div className={s.media}>
        <ArenaPlaceholder variant="cover" label="PLACEHOLDER — MOTAR SIMULATION VIDEO" />
      </div>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>Problem</h2>
        <p className={s.q}>Why is chasing a moving target harder than ordinary navigation?</p>
        <div className={s.factGrid}>
          {PROBLEMS.map((p) => (
            <div key={p.id} className={s.factCard}>
              <div className={s.mono11m}>{p.id}</div>
              <div className={s.factLabel}>{p.label}</div>
              <p className={s.factBody}>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>Approach</h2>
        <p className={s.q}>See, decide, fly — with nothing but onboard sensors.</p>
        <div className={s.factGrid}>
          {APPROACH.map((a) => (
            <div key={a.id} className={s.factCard}>
              <div className={s.mono11m}>{a.id}</div>
              <div className={s.factLabel}>{a.label}</div>
              <p className={s.factBody}>{a.body}</p>
            </div>
          ))}
        </div>
        <div className={s.deepDive}>
          <span className={styles.deepDiveText}>
            Full system architecture, observation design, and rates &amp; spec.
          </span>
          <Link href="/research/motar">Technical Notes →</Link>
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>Current Status</h2>
        <p className={s.lead}>Status is reported as measured; claims stop where the evidence stops.</p>
        <div className={styles.statusList}>
          <div className={s.statusRow}>
            <span className={s.statusLabel}>Simulation</span>
            <span className={s.statusChip}>
              <span className={s.dotSignal} />
              ACTIVE
            </span>
          </div>
          <div className={s.statusRow}>
            <span className={s.statusLabel}>Corrected environment</span>
            <span className={s.statusChip}>
              <span className={s.dotInk} />
              VERIFIED
            </span>
          </div>
          <div className={s.statusRow}>
            <span className={s.statusLabel}>Physical target routing</span>
            <span className={s.statusChip}>
              <span className={s.cross}>×</span>
              FAILED GATE
            </span>
          </div>
          <div className={s.statusRow}>
            <span className={s.statusLabel}>Hardware</span>
            <span className={`${s.statusChip} ${styles.chipMuted}`}>
              <span className={s.dotHollow} />
              PENDING
            </span>
          </div>
          <div className={`${s.statusRow} ${s.statusRowEnd}`}>
            <span className={s.statusLabel}>Real-world flights</span>
            <span className={styles.statusZero}>0</span>
          </div>
        </div>
        <div className={s.deepDive}>
          <span className={styles.repoText}>
            <span className={s.mono11m}>GITHUB</span>
            <b>
              {site.githubHandle} / MOTAR
            </b>
            <span className={s.mono11m}>PUBLIC · research/navrl-env</span>
          </span>
          <a href={site.motarRepo} target="_blank" rel="noreferrer">
            Repository ↗
          </a>
        </div>
      </section>
    </main>
  );
}
