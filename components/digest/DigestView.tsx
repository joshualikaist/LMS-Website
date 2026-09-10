import Link from "next/link";
import type { DigestEdition, DigestItem, DigestLane } from "@/content/digest/types";
import { ITEMS_PER_LANE, LANE_LABEL, LANE_ORDER } from "@/content/digest/types";
import s from "@/styles/shared.module.css";
import EditionCalendar from "./EditionCalendar";
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

function leadStory(edition: DigestEdition): DigestItem | null {
  const ranked = [...edition.items].sort((a, b) => {
    const hits = (b.interestHits?.length ?? 0) - (a.interestHits?.length ?? 0);
    if (hits !== 0) return hits;
    return (b.score ?? 0) - (a.score ?? 0);
  });
  return ranked[0] ?? null;
}

function articleLine(item: DigestItem) {
  const summary = item.summary?.trim();
  if (summary) return summary;
  const comment = item.comment?.trim();
  if (comment && !comment.startsWith("Watch —")) return comment;
  return `From ${item.source}.`;
}

function NewsColumn({ lane, items }: { lane: DigestLane; items: DigestItem[] }) {
  return (
    <section className={styles.column} id={`lane-${lane}`} aria-labelledby={`title-${lane}`}>
      <div className={styles.columnHead}>
        <h2 id={`title-${lane}`} className={styles.columnTitle}>
          {LANE_LABEL[lane]}
        </h2>
        <a href={`#lane-${lane}`} className={styles.followBtn}>
          Follow
        </a>
      </div>
      {items.length ? (
        <ol className={styles.newsList}>
          {items.map((item) => (
            <li key={item.id} className={styles.newsItem}>
              <a href={item.url} target="_blank" rel="noreferrer" className={styles.newsLink}>
                <span className={styles.headline}>{item.title}</span>
                <span className={styles.dek}>
                  <span className={styles.newsSource}>{item.source}</span>
                  {articleLine(item)}
                </span>
              </a>
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
  const lead = leadStory(edition);

  return (
    <>
      {lead ? (
        <a href={lead.url} target="_blank" rel="noreferrer" className={styles.banner}>
          <div className={styles.bannerInner}>
            <div className={styles.bannerMeta}>
              <span className={styles.bannerChip}>{LANE_LABEL[lead.lane]}</span>
              <span>Morning edition</span>
              <span>{displayDate(edition.date)}</span>
              <span>{lead.source}</span>
            </div>
            <h1 className={styles.bannerTitle}>{lead.title}</h1>
            <p className={styles.bannerDeck}>{articleLine(lead)}</p>
            <span className={styles.bannerContinue}>Continue reading</span>
          </div>
        </a>
      ) : null}

      <div className={`pageWide ${styles.shell}`}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Your News</h2>
          <span className={styles.sectionNote}>
            {displayDate(edition.date)} · {fetchedClock(edition.fetchedAt)} KST
          </span>
        </div>

        <div className={styles.board}>
          <aside className={styles.follow} aria-label="Lanes and editions">
            <div className={styles.followKicker}>Follow lanes</div>
            <p className={styles.followLead}>Four desks. Five links each.</p>
            <div className={styles.pills}>
              {LANE_ORDER.map((lane) => (
                <a key={lane} href={`#lane-${lane}`} className={styles.pill}>
                  <span aria-hidden="true">+</span>
                  {LANE_LABEL[lane]}
                </a>
              ))}
            </div>
            <div className={styles.calSlot}>
              <EditionCalendar key={edition.date} dates={dates} current={edition.date} />
            </div>
          </aside>

          <div className={styles.columns}>
            {LANE_ORDER.map((lane) => (
              <NewsColumn key={lane} lane={lane} items={byLane[lane]} />
            ))}
          </div>
        </div>

        <nav className={styles.pager} aria-label="Edition navigation">
          {older ? (
            <Link href={`/trend/${older}`} className={styles.pagerLink}>
              ← {displayDate(older)}
            </Link>
          ) : (
            <span className={s.pending}>Oldest</span>
          )}
          {newer ? (
            <Link href={newer === dates[0] ? "/trend" : `/trend/${newer}`} className={styles.pagerLink}>
              {displayDate(newer)} →
            </Link>
          ) : (
            <span className={s.pending}>{latest ? "Latest" : ""}</span>
          )}
        </nav>

        {dates.length > 1 ? (
          <details className={styles.archive}>
            <summary>Archive</summary>
            <div className={styles.archiveList}>
              {dates.map((date) => (
                <Link
                  key={date}
                  href={date === dates[0] ? "/trend" : `/trend/${date}`}
                  className={styles.archiveLink}
                >
                  {displayDate(date)}
                  {date === dates[0] ? " · latest" : ""}
                </Link>
              ))}
            </div>
          </details>
        ) : null}
      </div>
    </>
  );
}
