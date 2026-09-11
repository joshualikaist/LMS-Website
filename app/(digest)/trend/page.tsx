import type { Metadata } from "next";
import DigestView from "@/components/digest/DigestView";
import { getLatestEdition, listEditionDates } from "@/content/digest/load";
import s from "@/styles/shared.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Trend",
  description: "Daily morning snapshot — trend, economy, design, and tech. Updated at 10:00 KST.",
};

export default function TrendPage() {
  const edition = getLatestEdition();
  const dates = listEditionDates();

  return (
    <main className={styles.main}>
      {edition ? (
        <DigestView edition={edition} dates={dates} />
      ) : (
        <div className={`pageWide ${styles.empty}`}>
          <p className={s.kicker}>MORNING EDITION · 10:00 KST</p>
          <h1 className={s.h1}>Trend</h1>
          <p className={s.lead}>
            Four lanes — trend, economy, design, and tech — five links each. Fetch with
            <code>npm run digest</code> or the Daily digest GitHub Action.
          </p>
          <p className={styles.pending}>
            Run <code>npm run digest</code> locally, or trigger the Daily digest GitHub Action.
          </p>
        </div>
      )}
    </main>
  );
}
