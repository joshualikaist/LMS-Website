import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrowserPlaceholder } from "@/components/media/Placeholders";
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
      <h1 className={`${s.h1} ${styles.title}`}>{item.name}</h1>
      <p className={s.lead}>{item.tagline}</p>
      <div className={`${s.metaRow} ${styles.meta}`}>
        <span className={s.mono12m}>{item.year}</span>
        <span className={s.mono12m}>{item.kind.toUpperCase()}</span>
        <span className={s.mono12m}>@{item.handle}</span>
      </div>
      <a href={item.url} target="_blank" rel="noreferrer" className={`${raised.btn} ${styles.open}`}>
        {item.urlLabel} →
      </a>
      <div className={s.media}>
        <BrowserPlaceholder title={item.name} label={`LIVE — ${item.handle}`} />
      </div>

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
          <a href={item.url} target="_blank" rel="noreferrer" className={raised.btn}>
            {item.urlLabel} →
          </a>
          <a href={item.instagram} target="_blank" rel="noreferrer" className={raised.btn}>
            Instagram @{item.instagramHandle} →
          </a>
          <Link href="/hobby" className={raised.btn}>
            All hobby
          </Link>
        </div>
      </section>
    </main>
  );
}
