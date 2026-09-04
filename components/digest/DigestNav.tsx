"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/theme/ThemeToggle";
import styles from "./DigestNav.module.css";

export default function DigestNav() {
  const pathname = usePathname();
  const onArchive = pathname.startsWith("/trend/");

  return (
    <header className={`${styles.bar} no-print`}>
      <div className={`page ${styles.inner}`}>
        <Link href="/trend" className={styles.brand}>
          Trend
        </Link>
        <div className={styles.controls}>
          <nav className={styles.links} aria-label="Trend navigation">
            <Link href="/trend" className={pathname === "/trend" ? styles.active : styles.link}>
              Today
            </Link>
            {onArchive ? <span className={styles.active}>Archive</span> : null}
            <Link href="/" className={styles.back}>
              Minseok Li ↗
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
