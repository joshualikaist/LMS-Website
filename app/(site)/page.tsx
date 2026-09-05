import Image from "next/image";
import Link from "next/link";
import SidebarDock from "@/components/layout/SidebarDock";
import DigestLink from "@/components/links/DigestLink";
import Lightbox from "@/components/media/Lightbox";
import { ArenaPlaceholder, BrowserPlaceholder } from "@/components/media/Placeholders";
import ProfilePhoto from "@/components/media/ProfilePhoto";
import { getLatestEdition } from "@/content/digest/load";
import { interests, news } from "@/content/profile";
import { site } from "@/content/site";
import s from "@/styles/shared.module.css";
import styles from "./page.module.css";

export default function HomePage() {
  const latest = getLatestEdition();
  const editionLabel = latest?.date.replaceAll("-", ".") ?? null;

  return (
    <main className={styles.main}>
      <div className={styles.layout}>
        {/* LEFT — stays in place while the right column scrolls */}
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

        {/* RIGHT — scrolling content */}
        <div className={styles.content}>
          <div className={styles.cover}>
            <Lightbox label="Minseok Li engineering field notes cover">
              <Image
                src="/og.png"
                alt="Minseok Li engineering field notes with abstract UAV navigation trajectories"
                width={1536}
                height={1024}
                priority
                className={styles.coverImage}
              />
            </Lightbox>
          </div>
          <p className={styles.bio}>
            I am an undergraduate student in Mechanical Engineering at <b>KAIST</b>, working on
            robotics and autonomous systems with the <b>Field AI &amp; Robotics Lab (FAIR Lab)</b>.
            My current research focuses on learning-based UAV navigation — teaching a drone to
            perceive, avoid, and intercept a moving target in cluttered environments using only its
            onboard sensors.
          </p>
          <p className={styles.reach}>
            I am always happy to talk about robotics and autonomous systems — feel free to reach out!
          </p>

          <section className={s.section}>
            <h2 className={s.sectionTitle}>News</h2>
            <ul className={styles.newsList}>
              {news.map((n) => (
                <li key={n.text} className={styles.newsItem}>
                  <span className={styles.newsDate}>[{n.date}]</span>
                  <span>{n.text}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={s.section}>
            <h2 className={s.sectionTitle}>Study</h2>
            <div className={styles.studyCard}>
              <div className={styles.studyBody}>
                <DigestLink className={styles.studyTitle}>Trend ↗</DigestLink>
                <p className={s.entryDesc}>
                  A separate daily board for trend, economy, design, and tech — five links per lane,
                  with a one-line note when a story matches UAV, robot learning, or the web work.
                </p>
                <div className={s.entryMeta}>
                  <span>Trend · Economy · Design · Tech</span>
                  <span className={s.statusChip}>
                    <span className={s.dotSignal} />
                    DAILY 10:00 KST
                  </span>
                </div>
                <DigestLink className={styles.studyLink}>
                  {editionLabel ? `[Open ${editionLabel} edition →]` : "[Open Trend →]"}
                </DigestLink>
              </div>
            </div>
          </section>

          <section className={s.section}>
            <h2 className={s.sectionTitle}>Research</h2>
            <div className={s.entry}>
              <div className={s.entryThumb}>
                <ArenaPlaceholder variant="hero" label="PLACEHOLDER — SIM GIF" />
              </div>
              <div className={s.entryBody}>
                <Link href="/work/motar" className={s.entryTitle}>
                  MOTAR: Sensor-Only UAV Interception of Moving Targets
                </Link>
                <p className={s.entryDesc}>
                  Moving-target interception in dense obstacle fields with a sensor-only UAV policy,
                  trained in simulation.
                </p>
                <div className={s.entryMeta}>
                  <span>FAIR Lab, KAIST · 2026 — ongoing</span>
                  <span className={s.statusChip}>
                    <span className={s.dotSignal} />
                    SIMULATION ACTIVE
                  </span>
                </div>
                <div className={s.entryLinks}>
                  <Link href="/work/motar">[Case Study]</Link>
                  <Link href="/research/motar">[Technical Notes]</Link>
                  <a href={site.motarRepo} target="_blank" rel="noreferrer">
                    [Code]
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className={s.section}>
            <h2 className={s.sectionTitle}>Projects</h2>
            <div className={s.entry}>
              <div className={s.entryThumb}>
                <BrowserPlaceholder title="MESC" label="PLACEHOLDER — SCREENSHOT" compact />
              </div>
              <div className={s.entryBody}>
                <Link href="/work/mesc" className={s.entryTitle}>
                  MESC: Student Council Website for KAIST Mechanical Engineering
                </Link>
                <p className={s.entryDesc}>
                  A single digital hub for department life — announcements, calendar, community,
                  student council fees, and study resources. Designed, built, and shipped end to end.
                </p>
                <div className={s.entryMeta}>
                  <span>Full-stack web development · 2026</span>
                </div>
                <div className={s.entryLinks}>
                  <Link href="/work/mesc">[Project Page]</Link>
                </div>
              </div>
            </div>
          </section>

          <section className={s.section}>
            <h2 className={s.sectionTitle}>Research Interests</h2>
            <ul className={`${s.bullets} ${styles.interests}`}>
              {interests.map((i) => (
                <li key={i.name}>
                  <b>{i.name}</b> — {i.desc}
                </li>
              ))}
            </ul>
          </section>

          <section className={s.section}>
            <h2 className={s.sectionTitle}>Experience</h2>
            <div className={styles.rows}>
              <div className={s.row}>
                <span className={s.rowDate}>2026.03 — Present</span>
                <span className={s.rowBody}>
                  <b>Field AI &amp; Robotics Lab, KAIST</b> — Undergraduate Student Researcher
                  <span className={s.rowSub}>UAV navigation · robot learning · autonomous systems</span>
                </span>
              </div>
              <div className={s.row}>
                <span className={s.rowDate}>2025.09 — 2026.01</span>
                <span className={s.rowBody}>
                  <b>Dynamic Robot Control &amp; Design Lab, KAIST</b> — Undergraduate Student
                  Researcher
                </span>
              </div>
              <div className={s.row}>
                <span className={s.rowDate}>2025.06 — 2025.08</span>
                <span className={s.rowBody}>
                  <b>Welaaa</b> — Marketing Communication Intern
                </span>
              </div>
            </div>
          </section>

          <section className={s.section}>
            <h2 className={s.sectionTitle}>Education</h2>
            <div className={styles.rows}>
              <div className={s.row}>
                <span className={s.rowDate}>2024 — 2028</span>
                <span className={s.rowBody}>
                  <b>KAIST</b> — B.S. in Mechanical Engineering
                  <span className={s.rowSub}>Korea Advanced Institute of Science and Technology</span>
                </span>
              </div>
              <div className={s.row}>
                <span className={s.rowDate}>2021 — 2024</span>
                <span className={s.rowBody}>
                  <b>Hansung Science High School</b>
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
