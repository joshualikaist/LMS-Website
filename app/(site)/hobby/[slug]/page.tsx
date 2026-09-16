import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import InstagramCircle from "@/components/hobby/InstagramCircle";
import { getHobby, hobbies } from "@/content/hobby";
import s from "@/styles/shared.module.css";
import raised from "@/styles/raised.module.css";
import styles from "../page.module.css";

type Params = { slug: string };

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
              className={styles.igLg}
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
          <h2 className={s.sectionTitle}>수상경력</h2>
          <ol className={styles.timeline}>
            {item.awards.map((award) => (
              <li key={`${award.when}-${award.title}`} className={styles.award}>
                <p className={styles.when}>{award.when}</p>
                <p className={styles.awardTitle}>{award.title}</p>
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
      </section>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>Links</h2>
        <div className={s.entryLinks}>
          {item.url !== item.instagram ? (
            <a href={item.url} target="_blank" rel="noreferrer" className={raised.btn}>
              {item.urlLabel} →
            </a>
          ) : null}
          <Link href="/hobby" className={raised.btn}>
            All hobby
          </Link>
        </div>
      </section>
    </main>
  );
}
