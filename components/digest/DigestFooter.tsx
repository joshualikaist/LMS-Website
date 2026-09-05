import Link from "next/link";
import raised from "@/styles/raised.module.css";
import styles from "./DigestFooter.module.css";

export default function DigestFooter() {
  return (
    <footer className={`${styles.bar} no-print`}>
      <div className={`pageWide ${styles.inner}`}>
        <div className={styles.copy}>
          <span>Trend</span>
          <span className={styles.dot}>·</span>
          <span>Updated daily at 10:00 KST</span>
        </div>
        <Link href="/" className={raised.btn}>
          Back to minseok.li
        </Link>
      </div>
    </footer>
  );
}
