import Link from "next/link";
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
        <Link href="/" className={styles.back}>
          Portfolio
        </Link>
      </div>
    </footer>
  );
}
