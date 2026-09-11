import HeroVideo from "@/components/home/HeroVideo";
import { site } from "@/content/site";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.stage} data-home>
      <HeroVideo />
      <div className={styles.copy}>
        <p className={styles.kicker}>KAIST · Daejeon</p>
        <h1 className={styles.name}>Minseok Li</h1>
        <p className={styles.line}>mechanical engineering, field robotics</p>
        <nav className={styles.social} aria-label="Profiles">
          <a href={site.github} target="_blank" rel="noreferrer" className={styles.socialItem}>
            <span>GitHub</span>
            <span className={styles.mark} aria-hidden="true">
              🐙
            </span>
          </a>
          {site.instagram ? (
            <a href={site.instagram} target="_blank" rel="noreferrer" className={styles.socialItem}>
              <span>Instagram</span>
              <span className={styles.mark} aria-hidden="true">
                📸
              </span>
            </a>
          ) : null}
          {site.linkedin ? (
            <a href={site.linkedin} target="_blank" rel="noreferrer" className={styles.socialItem}>
              <span>LinkedIn</span>
              <span className={styles.mark} aria-hidden="true">
                💼
              </span>
            </a>
          ) : null}
          {site.email ? (
            <a href={`mailto:${site.email}`} className={styles.socialItem}>
              <span>Email</span>
              <span className={styles.mark} aria-hidden="true">
                ✉️
              </span>
            </a>
          ) : null}
        </nav>
      </div>
    </main>
  );
}
