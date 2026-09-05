"use client";

import { useState } from "react";
import { site } from "@/content/site";
import raised from "@/styles/raised.module.css";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  const [open, setOpen] = useState(false);

  return (
    <footer className={`${styles.bar} no-print`}>
      <div className={`page ${styles.inner}`}>
        <div className={styles.copyright}>© 2026 Minseok Li</div>
        <div className={styles.right}>
          {site.email ? (
            <a href={`mailto:${site.email}`} className={raised.btn}>
              Email
            </a>
          ) : null}
          {site.linkedin ? (
            <a href={site.linkedin} target="_blank" rel="noreferrer" className={raised.btn}>
              LinkedIn
            </a>
          ) : null}
          {site.instagram ? (
            <a href={site.instagram} target="_blank" rel="noreferrer" className={raised.btn}>
              Instagram
            </a>
          ) : null}
          <a href={site.github} target="_blank" rel="noreferrer" className={raised.btn}>
            GitHub ↗
          </a>
          <button
            type="button"
            className={`${raised.btn} ${raised.mono}`}
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
DIGEST ......... TREND · DAILY 10:00 KST
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
