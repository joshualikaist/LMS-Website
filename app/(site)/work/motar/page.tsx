import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
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

export default function MotarPage() {
  return (
    <main className={`page ${styles.main}`}>
      <p className={styles.kicker}>Research</p>
      <h1 className={styles.title}>MOTAR</h1>
      <p className={styles.dek}>
        Teaching a drone to intercept a moving target — with nothing but its own sensors.
      </p>
      <p className={styles.meta}>2026 · FAIR Lab, KAIST · ongoing</p>

      <section className={styles.block}>
        <h2 className={styles.h2}>Why</h2>
        <p>
          Ordinary navigation goes to a place that stays put. Interception does not. The goal is a
          future position of something that is still moving, and every obstacle that hides the
          target also breaks the path that would have reached it.
        </p>
        <p>
          The drone has to keep going on what it last saw, while the safe route and the intercepting
          route keep drifting apart.
        </p>
      </section>

      <section className={styles.block}>
        <h2 className={styles.h2}>How</h2>
        <p>
          A camera and LiDAR give it a view of the scene — no external tracking, no prebuilt map. A
          learned policy turns that view into the next maneuver, trained in simulation. A flight
          controller keeps each command inside what the aircraft can actually do.
        </p>
      </section>

      <section className={styles.block}>
        <h2 className={styles.h2}>Now</h2>
        <p>
          Simulation is running, and the corrected environment is verified. Physical target routing
          did not pass its gate. Hardware work has not started, and there have been no real-world
          flights.
        </p>
      </section>

      <nav className={styles.links} aria-label="MOTAR links">
        <Link href="/research/motar">Technical notes</Link>
        <a href={site.motarRepo} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </nav>
    </main>
  );
}
