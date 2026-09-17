"use client";

import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { site } from "@/content/site";
import styles from "./SiteFooter.module.css";

function isTrend(pathname: string) {
  return (
    pathname === site.digest ||
    pathname.startsWith(`${site.digest}/`) ||
    pathname.startsWith("/digest")
  );
}

export default function SiteFooter() {
  const pathname = usePathname();
  const trend = isTrend(pathname);
  const home = pathname === "/";

  return (
    <footer
      className={`${styles.bar} ${trend ? styles.onDigest : ""} ${home ? styles.onHome : ""} no-print`}
    >
      <div className={styles.inner}>
        <div className={styles.left}>
          <button
            type="button"
            className={styles.navBtn}
            aria-label="Back"
            onClick={() => window.history.back()}
          >
            ←
          </button>
          <div className={styles.copyright}>© 2026 Minseok Li</div>
        </div>
        <div className={styles.links}>
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
            GitHub
          </a>
        </div>
        <div className={styles.right}>
          {trend ? <ThemeToggle /> : null}
          <button
            type="button"
            className={styles.navBtn}
            aria-label="Forward"
            onClick={() => window.history.forward()}
          >
            →
          </button>
        </div>
      </div>
    </footer>
  );
}
