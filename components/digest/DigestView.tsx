import Link from "next/link";
import type { DigestEdition, DigestItem, DigestLane } from "@/content/digest/types";
import { ITEMS_PER_LANE, LANE_LABEL, LANE_ORDER } from "@/content/digest/types";
import s from "@/styles/shared.module.css";
import styles from "./DigestView.module.css";

const displayDate = (isoDate: string) => isoDate.replaceAll("-", ".");

const fetchedClock = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));

function laneItems(edition: DigestEdition, lane: DigestLane): DigestItem[] {
  return edition.items.filter((item) => item.lane === lane).slice(0, ITEMS_PER_LANE);
}

function NewsColumn({ lane, items }: { lane: DigestLane; items: DigestItem[] }) {
  return (
    <section className={styles.column} aria-labelledby={`lane-${lane}`}>
      <h2 id={`lane-${lane}`} className={styles.columnTitle}>
        {LANE_LABEL[lane]}
      </h2>
      {items.length ? (
        <ol className={styles.newsList}>
          {items.map((item, index) => (
            <li key={item.id} className={styles.newsItem}>
              <span className={styles.rank}>{String(index + 1).padStart(2, "0")}</span>
              <div className={styles.newsBody}>
                <a href={item.url} target="_blank" rel="noreferrer" className={styles.newsLink}>
                  {item.title}
                </a>
                {item.comment ? <span className={styles.newsComment}>{item.comment}</span> : null}
                <span className={styles.newsSource}>{item.source}</span>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className={styles.emptyLane}>No items for this lane today.</p>
      )}
    </section>
  );
}

export default function DigestView({
  edition,
  dates,
  latest,
}: {
  edition: DigestEdition;
  dates: string[];
  latest: boolean;
}) {
  const newer = dates[dates.indexOf(edition.date) - 1];
  const older = dates[dates.indexOf(edition.date) + 1];
  const byLane = Object.fromEntries(
    LANE_ORDER.map((lane) => [lane, laneItems(edition, lane)]),
  ) as Record<DigestLane, DigestItem[]>;

  return (
    <>
      <div className={styles.head}>
        <div>
          <p className={`${s.kicker} ${styles.kicker}`}>MORNING EDITION · 10:00 KST</p>
          <h1 className={s.h1}>Trend</h1>
        </div>
        <span className={s.statusChip}>
          <span className={latest ? s.dotSignal : s.dotInk} />
          {latest ? "LATEST" : displayDate(edition.date)}
        </span>
      </div>
      <p className={s.lead}>
        Four lanes — trend, economy, design, and tech — five links each. Items that match UAV,
        robot learning, or design-system work float up and get a one-line note.
      </p>
      <div className={styles.meta}>
        <span>{displayDate(edition.date)}</span>
        <span>Fetched {fetchedClock(edition.fetchedAt)} KST</span>
        {edition.failures.length ? <span>{edition.failures.length} source miss(es)</span> : null}
      </div>

      <div className={styles.grid}>
        {LANE_ORDER.map((lane) => (
          <NewsColumn key={lane} lane={lane} items={byLane[lane]} />
        ))}
      </div>

      <nav className={styles.pager} aria-label="Edition navigation">
        {older ? (
          <Link href={`/trend/${older}`}>← {displayDate(older)}</Link>
        ) : (
          <span className={s.pending}>Oldest edition</span>
        )}
        {newer ? (
          <Link href={newer === dates[0] ? "/trend" : `/trend/${newer}`}>{displayDate(newer)} →</Link>
        ) : (
          <span className={s.pending}>{latest ? "Latest edition" : ""}</span>
        )}
      </nav>

      {dates.length > 1 ? (
        <section className={s.section}>
          <h2 className={s.sectionTitle}>Archive</h2>
          <div className={styles.archiveList}>
            {dates.map((date) => (
              <div key={date} className={s.row}>
                <span className={s.rowDate}>{displayDate(date)}</span>
                <span className={s.rowBody}>
                  <Link href={date === dates[0] ? "/trend" : `/trend/${date}`}>Morning edition</Link>
                  {date === dates[0] ? <span className={s.rowSub}>Latest</span> : null}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
