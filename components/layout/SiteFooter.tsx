"use client";

import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <footer className={`${styles.bar} no-print`}>
      <div className={`page ${styles.inner}`}>
        <div className={styles.copyright}>© 2026 Minseok Li</div>
        <div className={styles.right}>
          {site.email ? (
            <a href={`mailto:${site.email}`} className={styles.link}>
              Email
            </a>
          ) : null}
          {site.linkedin ? (
            <a href={site.linkedin} target="_blank" rel="noreferrer" className={styles.link}>
              LinkedIn
            </a>
          ) : null}
          {site.instagram ? (
            <a href={site.instagram} target="_blank" rel="noreferrer" className={styles.link}>
              Instagram
            </a>
          ) : null}
          <a href={site.github} target="_blank" rel="noreferrer" className={styles.link}>
            GitHub ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
