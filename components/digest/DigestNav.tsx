"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/theme/ThemeToggle";
import styles from "./DigestNav.module.css";

export default function DigestNav() {
  const pathname = usePathname();
  const onArchive = pathname.startsWith("/digest/");

  return (
    <header className={`${styles.bar} no-print`}>
      <div className={`page ${styles.inner}`}>
        <Link href="/digest" className={styles.brand}>
          Morning Digest
        </Link>
        <div className={styles.controls}>
          <nav className={styles.links} aria-label="Digest navigation">
            <Link href="/digest" className={pathname === "/digest" ? styles.active : styles.link}>
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
