import Link from "next/link";
import type { DigestEdition, DigestItem, DigestLane } from "@/content/digest/types";
import { LANE_LABEL, LANE_ORDER } from "@/content/digest/types";
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

const scoreText = (item: DigestItem) => {
  if (item.score == null || !item.scoreLabel) return null;
  return `${item.score.toLocaleString("en-US")} ${item.scoreLabel}`;
};

function ItemRow({ item }: { item: DigestItem }) {
  const score = scoreText(item);
  return (
    <div className={s.row}>
      <span className={`${s.rowDate} ${styles.source}`}>{item.source}</span>
      <span className={s.rowBody}>
        <a href={item.url} target="_blank" rel="noreferrer" className={styles.title}>
          {item.title}
        </a>
        {item.summary ? <span className={s.rowSub}>{item.summary}</span> : null}
        {item.author ? <span className={styles.author}>{item.author}</span> : null}
      </span>
      {score ? <span className={styles.score}>{score}</span> : null}
    </div>
  );
}

function LaneSection({ lane, items }: { lane: DigestLane; items: DigestItem[] }) {
  return (
    <section className={s.section}>
      <h2 className={s.sectionTitle}>{LANE_LABEL[lane]}</h2>
      {items.length ? (
        <div className={styles.list}>
          {items.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className={styles.emptyLane}>No items in this lane for this edition.</p>
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
  const byLane = Object.fromEntries(LANE_ORDER.map((lane) => [lane, edition.items.filter((item) => item.lane === lane)])) as Record<
    DigestLane,
    DigestItem[]
  >;

  return (
    <>
      <div className={styles.head}>
        <div>
          <p className={`${s.kicker} ${styles.kicker}`}>MORNING EDITION · 10:00 KST</p>
          <h1 className={s.h1}>Morning Digest</h1>
        </div>
        <span className={s.statusChip}>
          <span className={latest ? s.dotSignal : s.dotInk} />
          {latest ? "LATEST" : displayDate(edition.date)}
        </span>
      </div>
      <p className={s.lead}>
        A daily snapshot of trend, tech, and design — fetched each morning and frozen as that
        day&apos;s edition. Built for study, not for refreshing.
      </p>
      <div className={styles.meta}>
        <span>{displayDate(edition.date)}</span>
        <span>Fetched {fetchedClock(edition.fetchedAt)} KST</span>
        <span>{edition.items.length} items</span>
        {edition.failures.length ? <span>{edition.failures.length} source miss(es)</span> : null}
      </div>
      {edition.failures.length ? (
        <p className={styles.failures}>
          Missed: {edition.failures.map((f) => f.sourceId).join(", ")}
        </p>
      ) : null}

      {LANE_ORDER.map((lane) => (
        <LaneSection key={lane} lane={lane} items={byLane[lane]} />
      ))}

      <nav className={styles.pager} aria-label="Edition navigation">
        {older ? (
          <Link href={`/digest/${older}`}>← {displayDate(older)}</Link>
        ) : (
          <span className={s.pending}>Oldest edition</span>
        )}
        {newer ? (
          <Link href={newer === dates[0] ? "/digest" : `/digest/${newer}`}>{displayDate(newer)} →</Link>
        ) : (
          <span className={s.pending}>{latest ? "Latest edition" : ""}</span>
        )}
      </nav>

      {dates.length > 1 ? (
        <section className={s.section}>
          <h2 className={s.sectionTitle}>Archive</h2>
          <div className={styles.list}>
            {dates.map((date) => (
              <div key={date} className={s.row}>
                <span className={s.rowDate}>{displayDate(date)}</span>
                <span className={s.rowBody}>
                  <Link href={date === dates[0] ? "/digest" : `/digest/${date}`}>
                    Morning edition
                  </Link>
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
