import DigestLink from "@/components/links/DigestLink";
import DroneFly from "@/components/home/DroneFly";
import { site } from "@/content/site";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.stage} data-home>
      <DroneFly />
      <div className={styles.copy}>
        <p className={styles.kicker}>KAIST · Daejeon</p>
        <h1 className={styles.name}>Minseok Li</h1>
        <p className={styles.line}>mechanical engineering, field robotics</p>
        <nav className={styles.social} aria-label="Profiles">
          <a href={site.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          {site.instagram ? (
            <a href={site.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
          ) : null}
          {site.linkedin ? (
            <a href={site.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          ) : null}
          {site.email ? <a href={`mailto:${site.email}`}>Email</a> : null}
        </nav>
        <div className={styles.actions}>
          <a href="/work/motar" className={styles.primary}>
            MOTAR
          </a>
          <DigestLink className={styles.ghost}>Trend</DigestLink>
        </div>
      </div>
    </main>
  );
}
