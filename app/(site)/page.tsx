import Link from "next/link";
import SidebarDock from "@/components/layout/SidebarDock";
import DigestLink from "@/components/links/DigestLink";
import ProfilePhoto from "@/components/media/ProfilePhoto";
import { getLatestEdition } from "@/content/digest/load";
import styles from "./page.module.css";

export default function HomePage() {
  const latest = getLatestEdition();
  const editionLabel = latest?.date.replaceAll("-", ".") ?? "Trend";

  return (
    <main className={styles.main}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.photo}>
            <ProfilePhoto alt="Minseok Li" />
          </div>
          <h1 className={styles.name}>Minseok Li</h1>
          <div className={styles.role}>Undergraduate Student</div>
          <div className={styles.role}>Mechanical Engineering</div>
          <div className={styles.affil}>KAIST · Daejeon, South Korea</div>
          <SidebarDock />
        </aside>

        <div className={styles.content}>
          <p className={styles.bio}>
            Mechanical engineering at <b>KAIST</b>. I work with the Field AI &amp; Robotics Lab on
            learning-based UAV navigation.
          </p>

          <nav className={styles.index} aria-label="Open a page">
            <Link href="/work/motar" className={styles.indexLink}>
              <span className={styles.indexLabel}>Research</span>
              MOTAR
            </Link>
            <Link href="/work/mesc" className={styles.indexLink}>
              <span className={styles.indexLabel}>Project</span>
              MESC
            </Link>
            <Link href="/notes" className={styles.indexLink}>
              <span className={styles.indexLabel}>Writing</span>
              Notes
            </Link>
            <DigestLink className={styles.indexLink}>
              <span className={styles.indexLabel}>Daily</span>
              {latest ? `Trend  ${editionLabel}` : "Trend"}
            </DigestLink>
          </nav>
        </div>
      </div>
    </main>
  );
}
