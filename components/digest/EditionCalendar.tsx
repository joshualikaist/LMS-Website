"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./EditionCalendar.module.css";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function parse(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toIso(y: number, m: number, d: number) {
  return `${y}-${pad(m)}-${pad(d)}`;
}

function shiftMonth(y: number, m: number, delta: number) {
  const next = new Date(y, m - 1 + delta, 1);
  return { y: next.getFullYear(), m: next.getMonth() + 1 };
}

function monthLabel(y: number, m: number) {
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(
    new Date(y, m - 1, 1),
  );
}

function mondayIndex(sundayIndex: number) {
  return (sundayIndex + 6) % 7;
}

export default function EditionCalendar({
  dates,
  current,
}: {
  dates: string[];
  current: string;
}) {
  const latest = dates[0];
  const oldest = dates[dates.length - 1];
  const available = useMemo(() => new Set(dates), [dates]);
  const selected = parse(current);
  const [view, setView] = useState({ y: selected.y, m: selected.m });

  if (!latest || !oldest) return null;

  const min = parse(oldest);
  const max = parse(latest);
  const canPrev = view.y > min.y || (view.y === min.y && view.m > min.m);
  const canNext = view.y < max.y || (view.y === max.y && view.m < max.m);
  const leadBlanks = mondayIndex(new Date(view.y, view.m - 1, 1).getDay());
  const lastDay = new Date(view.y, view.m, 0).getDate();
  const cells: Array<number | null> = [
    ...Array.from({ length: leadBlanks }, () => null),
    ...Array.from({ length: lastDay }, (_, i) => i + 1),
  ];

  return (
    <div className={styles.cal}>
      <p className={styles.stamp}>{current.replaceAll("-", ".")}</p>
      <div className={styles.monthRow}>
        <button
          type="button"
          className={styles.shift}
          disabled={!canPrev}
          aria-label="Previous month"
          onClick={() => setView((now) => shiftMonth(now.y, now.m, -1))}
        >
          ‹
        </button>
        <p className={styles.month}>{monthLabel(view.y, view.m)}</p>
        <button
          type="button"
          className={styles.shift}
          disabled={!canNext}
          aria-label="Next month"
          onClick={() => setView((now) => shiftMonth(now.y, now.m, 1))}
        >
          ›
        </button>
      </div>
      <div className={styles.week} aria-hidden="true">
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className={styles.grid} role="grid" aria-label="Morning editions">
        {cells.map((day, index) => {
          if (!day) {
            return <span key={`blank-${index}`} className={styles.blank} />;
          }
          const id = toIso(view.y, view.m, day);
          const has = available.has(id);
          const on = id === current;
          if (!has) {
            return (
              <span key={id} className={styles.muted}>
                {day}
              </span>
            );
          }
          return (
            <Link
              key={id}
              href={id === latest ? "/trend" : `/trend/${id}`}
              className={on ? styles.on : styles.day}
              aria-current={on ? "date" : undefined}
              aria-label={`Trend ${id}`}
            >
              {day}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
