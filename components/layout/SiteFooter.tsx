"use client";

import { useState } from "react";
import { site } from "@/content/site";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  const [open, setOpen] = useState(false);

  return (
    <footer className={`${styles.bar} no-print`}>
      <div className={`page ${styles.inner}`}>
        <div className={styles.copyright}>© 2026 Minseok Li</div>
        <div className={styles.right}>
          <a href={site.github} target="_blank" rel="noreferrer" className={styles.link}>
            GitHub ↗
          </a>
          <button
            type="button"
            className={styles.statusButton}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            SYSTEM STATUS
          </button>
        </div>
      </div>
      {open && (
        <div className={`page ${styles.terminalWrap}`}>
          <div className={styles.terminal}>
            <div className={styles.terminalTitle}>MINSEOK.LI / STATUS</div>
            <pre className={styles.terminalBody}>
{`RESEARCH ....... `}<span className={styles.valSignal}>ACTIVE</span>{`
MOTAR .......... `}<span className={styles.valSignal}>ONGOING</span>{`
DIGEST ......... DAILY 10:00 KST
HARDWARE ....... PENDING
WEBSITE ........ `}<span className={styles.valLight}>ONLINE</span>{`
COFFEE ......... LOW`}
            </pre>
          </div>
        </div>
      )}
    </footer>
  );
}
