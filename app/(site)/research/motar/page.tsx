import type { Metadata } from "next";
import Link from "next/link";
import ContractTable from "@/components/motar/ContractTable";
import SystemDiagram from "@/components/motar/SystemDiagram";
import s from "@/styles/shared.module.css";
import raised from "@/styles/raised.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "MOTAR — Technical Notes",
  description:
    "The system architecture and engineering contract behind the MOTAR case study — for readers who build these systems.",
  openGraph: {
    title: "MOTAR Technical Notes — Minseok Li",
    description: "System architecture and engineering contract for the MOTAR UAV research project.",
    type: "article",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "MOTAR Technical Notes — Minseok Li",
    description: "System architecture and engineering contract for the MOTAR UAV research project.",
    images: [],
  },
};

export default function MotarTechnicalPage() {
  return (
    <main className={`page ${styles.main}`}>
      <div className={s.kicker}>RESEARCH / MOTAR / TECHNICAL</div>
      <h1 className={`${s.h1} ${styles.title}`}>MOTAR — Technical Notes</h1>
      <p className={s.lead}>
        The system architecture and engineering contract behind the case study — for readers who
        build these systems.
      </p>
      <Link href="/work/motar" className={`${raised.btn} ${styles.backLink}`}>
        ← Back to the case study
      </Link>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>System</h2>
        <p className={s.q}>From raw sensing to a bounded body-frame command.</p>
        <div className={styles.diagram}>
          <SystemDiagram />
        </div>
        <p className={s.mono11m}>
          FINAL FIGURES — motar-system-overview.svg · motar-control-stack.svg (REPO)
        </p>
      </section>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>System Contract</h2>
        <div className={styles.contract}>
          <ContractTable />
        </div>
      </section>
    </main>
  );
}
