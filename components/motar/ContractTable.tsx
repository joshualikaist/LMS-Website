"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ContractTable.module.css";

type Row = {
  label: string;
  /** Static display string (used as-is when no count animation applies). */
  display: string;
  /** When set, the numeric part counts up from 0 on first scroll into view. */
  count?: { to: number; suffix: string };
};

const ROWS: Row[] = [
  { label: "OBSERVATION", display: "898 D", count: { to: 898, suffix: " D" } },
  { label: "TOKENS", display: "17", count: { to: 17, suffix: "" } },
  { label: "LIDAR", display: "4 × 72" },
  { label: "POLICY RATE", display: "10 Hz", count: { to: 10, suffix: " Hz" } },
  { label: "PHYSICS RATE", display: "100 Hz", count: { to: 100, suffix: " Hz" } },
  { label: "ARENA", display: "40 × 40 m" },
  { label: "TARGET SPEED", display: "0.3 — 1.5 m/s" },
];

const DURATION_MS = 400;

export default function ContractTable() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(1); // render final values on the server / without JS
  const started = useRef(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    setProgress(0);
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || started.current) return;
        started.current = true;
        observer.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / DURATION_MS);
          setProgress(p);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={styles.table}>
      {ROWS.map((row, i) => {
        const value = row.count
          ? `${Math.round(row.count.to * progress)}${row.count.suffix}`
          : row.display;
        const last = i === ROWS.length - 1;
        return (
          <div key={row.label} className={last ? `${styles.row} ${styles.rowLast}` : styles.row}>
            <div className={styles.label}>{row.label}</div>
            <div className={styles.leader} />
            <div className={styles.value}>{value}</div>
          </div>
        );
      })}
    </div>
  );
}
