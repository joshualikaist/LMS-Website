import type { Metadata } from "next";
import { BrowserPlaceholder } from "@/components/media/Placeholders";
import s from "@/styles/shared.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "MESC",
  description:
    "The KAIST Mechanical Engineering Student Council website — a single digital hub for department life.",
  openGraph: {
    title: "MESC — Minseok Li",
    description: "A digital hub for the KAIST Mechanical Engineering student community.",
    type: "article",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "MESC — Minseok Li",
    description: "A digital hub for the KAIST Mechanical Engineering student community.",
    images: [],
  },
};

const PRODUCT = [
  "Announcements",
  "Calendar",
  "Community",
  "Student council fee",
  "Study resources",
];

// Fill in the real stack per area — placeholders render until then.
const ENGINEERING = [
  { area: "FRONTEND", value: "[FRAMEWORK]" },
  { area: "BACKEND", value: "[RUNTIME / API]" },
  { area: "DATABASE", value: "[DATABASE]" },
  { area: "DEPLOYMENT", value: "[HOSTING]" },
];

export default function MescPage() {
  return (
    <main className={`page ${styles.main}`}>
      <div className={s.kicker}>WORK / MESC</div>
      <h1 className={`${s.h1} ${styles.title}`}>MESC</h1>
      <p className={s.lead}>Student Council Website for KAIST Mechanical Engineering.</p>
      <div className={`${s.metaRow} ${styles.meta}`}>
        <span className={s.mono12m}>2026</span>
        <span className={s.mono12m}>FULL-STACK WEB DEVELOPMENT</span>
      </div>
      <div className={s.media}>
        <BrowserPlaceholder title="MESC — STUDENT COUNCIL WEBSITE" label="PLACEHOLDER — MESC WEBSITE SCREENSHOT" />
      </div>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>Problem</h2>
        <p className={s.q}>Department information was distributed across multiple platforms.</p>
      </section>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>Product</h2>
        <p className={s.q}>One place for everything students actually need.</p>
        <ol className={styles.productList}>
          {PRODUCT.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>Engineering</h2>
        <p className={s.q}>Designed, built, and shipped end to end.</p>
        <div className={styles.engGrid}>
          {ENGINEERING.map((e) => (
            <div key={e.area} className={s.factCard}>
              <div className={s.factLabel}>{e.area}</div>
              <div className={`${s.mono12m} ${styles.engValue}`}>{e.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>Result</h2>
        <p className={s.q}>A single digital hub for KAIST Mechanical Engineering students.</p>
        <p className={s.mono12m}>SITE — [ADD URL WHEN PUBLIC]</p>
      </section>
    </main>
  );
}
