import type { Metadata } from "next";
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

// Fill these in when they exist — anything left null stays off the page.
const SCREENSHOT: string | null = null;
const SITE_URL: string | null = null;
const ENGINEERING: { area: string; value: string | null }[] = [
  { area: "FRONTEND", value: null },
  { area: "BACKEND", value: null },
  { area: "DATABASE", value: null },
  { area: "DEPLOYMENT", value: null },
];

export default function MescPage() {
  const stack = ENGINEERING.filter((e) => e.value);

  return (
    <main className={`page ${styles.main}`}>
      <div className={s.kicker}>WORK / MESC</div>
      <h1 className={`${s.h1} ${styles.title}`}>MESC</h1>
      <p className={s.lead}>Student Council Website for KAIST Mechanical Engineering.</p>
      <div className={`${s.metaRow} ${styles.meta}`}>
        <span className={s.mono12m}>2026</span>
        <span className={s.mono12m}>FULL-STACK WEB DEVELOPMENT</span>
      </div>
      {SCREENSHOT ? (
        <div className={s.media}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SCREENSHOT} alt="MESC student council website" />
        </div>
      ) : null}

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
        {stack.length > 0 ? (
          <div className={styles.engGrid}>
            {stack.map((e) => (
              <div key={e.area} className={s.factCard}>
                <div className={s.factLabel}>{e.area}</div>
                <div className={`${s.mono12m} ${styles.engValue}`}>{e.value}</div>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>Result</h2>
        <p className={s.q}>A single digital hub for KAIST Mechanical Engineering students.</p>
        {SITE_URL ? (
          <p className={s.mono12m}>
            SITE — <a href={SITE_URL} target="_blank" rel="noreferrer">{SITE_URL.replace(/^https?:\/\//, "")}</a>
          </p>
        ) : null}
      </section>
    </main>
  );
}
