"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/theme/ThemeToggle";
import raised from "@/styles/raised.module.css";
import styles from "./DigestNav.module.css";

export default function DigestNav() {
  const pathname = usePathname();
  const onArchive = pathname.startsWith("/trend/");

  return (
    <header className={`${styles.bar} no-print`}>
      <div className={`pageWide ${styles.inner}`}>
        <Link href="/trend" className={styles.brand}>
          Trend
        </Link>
        <div className={styles.controls}>
          <nav className={styles.links} aria-label="Trend navigation">
            <Link href="/trend" className={`${raised.btn} ${pathname === "/trend" ? raised.on : ""}`}>
              Today
            </Link>
            {onArchive ? <span className={`${raised.btn} ${raised.on}`}>Archive</span> : null}
            <Link href="/" className={raised.btn}>
              Minseok Li ↗
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
