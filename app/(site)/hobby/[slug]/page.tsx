import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InstagramCircle from "@/components/hobby/InstagramCircle";
import { getHobby, hobbies } from "@/content/hobby";
import s from "@/styles/shared.module.css";
import raised from "@/styles/raised.module.css";
import styles from "../page.module.css";

type Params = { slug: string };

// Only the dates/slugs generated at build time exist. Anything else is a plain 404 and, importantly,
// never makes the server try to render and cache a page for an arbitrary URL.
export const dynamicParams = false;

export function generateStaticParams() {
  return hobbies.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getHobby(slug);
  if (!item) return { title: "Hobby" };
  return {
    title: item.name,
    description: item.tagline,
  };
}

export default async function HobbyProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const item = getHobby(slug);
  if (!item) notFound();

  return (
    <main className={`page ${styles.main}`}>
      <div className={s.kicker}>{item.kicker}</div>
      <div className={styles.profile}>
        <InstagramCircle
          src={`${item.photoDir}/avatar.jpg`}
          label={item.name}
          href={item.instagram}
          size={128}
        />
        <div>
          <div className={styles.nameRow}>
            <a
              href={item.instagram}
              target="_blank"
              rel="noreferrer"
              className={`${raised.btn} ${styles.igLg}`}
              aria-label={`Instagram @${item.instagramHandle}`}
            >
              <img src="/icons/instagram.svg" alt="" />
            </a>
            <h1 className={`${s.h1} ${styles.title}`}>{item.name}</h1>
          </div>
          <p className={s.lead}>{item.tagline}</p>
          <div className={`${s.metaRow} ${styles.meta}`}>
            <span className={s.mono12m}>{item.year}</span>
            <span className={s.mono12m}>{item.kind.toUpperCase()}</span>
            <span className={s.mono12m}>@{item.instagramHandle}</span>
          </div>
        </div>
      </div>

      {item.awards?.length ? (
        <section className={s.section}>
          <h2 className={s.sectionTitle}>수상경력 / Awards</h2>
          <ol className={styles.timeline}>
            {item.awards.map((award) => (
              <li key={`${award.when}-${award.title}`} className={styles.award}>
                <p className={styles.when}>{award.when}</p>
                <p className={styles.awardTitle}>
                  {award.title}
                  {award.titleEn ? ` / ${award.titleEn}` : ""}
                </p>
                <p className={styles.place}>{award.place}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className={s.section}>
        <h2 className={s.sectionTitle}>About</h2>
        {item.about.map((paragraph) => (
          <p key={paragraph} className={styles.copy}>
            {paragraph}
          </p>
        ))}
        {item.url.startsWith("http") || item.repo ? (
          <div className={`${s.entryLinks} ${styles.aboutLinks}`}>
            {item.url.startsWith("http") ? (
              <a href={item.url} target="_blank" rel="noreferrer" className={raised.btn}>
                {item.urlLabel} →
              </a>
            ) : null}
            {item.repo ? (
              <a href={item.repo} target="_blank" rel="noreferrer" className={raised.btn}>
                GitHub →
              </a>
            ) : null}
          </div>
        ) : null}
      </section>

      {item.screens?.length ? (
        <section className={s.section}>
          <h2 className={s.sectionTitle}>화면 / Screens</h2>
          <div className={styles.screens}>
            {item.screens.map((screen) => (
              <figure key={screen.title} className={styles.screen}>
                <img
                  src={screen.image}
                  alt={`${item.name} — ${screen.title} 화면`}
                  width={1280}
                  height={800}
                  loading="lazy"
                />
                <figcaption>
                  <b>{screen.title}</b>
                  <span>{screen.caption}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {item.howItWorks ? (
        <section className={s.section}>
          <h2 className={s.sectionTitle}>작동 방식 / How it works</h2>
          <div className={styles.how}>
            <div className={styles.howBody}>
              <ol className={styles.flow}>
                {item.howItWorks.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className={styles.copy}>{item.howItWorks.text}</p>
            </div>
            {item.howItWorks.image ? (
              <img
                className={styles.phone}
                src={item.howItWorks.image}
                alt={item.howItWorks.imageAlt ?? ""}
                width={240}
                height={480}
                loading="lazy"
              />
            ) : null}
          </div>
        </section>
      ) : null}
    </main>
  );
}
