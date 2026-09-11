import Link from "next/link";
import ThemeToggle from "@/components/theme/ThemeToggle";
import styles from "./DigestFooter.module.css";

export default function DigestFooter() {
  return (
    <footer className={`${styles.bar} no-print`}>
      <div className={`pageWide ${styles.inner}`}>
        <div className={styles.copy}>
          <span>Trend</span>
          <span className={styles.dot}>·</span>
          <span>Daily 10:00 KST</span>
        </div>
        <div className={styles.right}>
          <ThemeToggle />
          <Link href="/" className={styles.back}>
            Home
          </Link>
        </div>
      </div>
    </footer>
  );
}
