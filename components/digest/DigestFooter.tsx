import Link from "next/link";
import styles from "./DigestFooter.module.css";

export default function DigestFooter() {
  return (
    <footer className={`${styles.bar} no-print`}>
      <div className={`page ${styles.inner}`}>
        <div className={styles.copy}>
          <span>Morning Digest</span>
          <span className={styles.dot}>·</span>
          <span>Updated daily at 10:00 KST</span>
        </div>
        <Link href="/" className={styles.back}>
          Back to minseok.li
        </Link>
      </div>
    </footer>
  );
}
