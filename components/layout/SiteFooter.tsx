"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
          {trend ? null : site.digestIsExternal ? (
            <a href={site.digest} className={styles.minor}>
              Trend ↗
            </a>
          ) : (
            <Link href={site.digest} className={styles.minor}>
              Trend
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
