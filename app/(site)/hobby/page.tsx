import type { Metadata } from "next";
import Link from "next/link";
import InstagramCircle from "@/components/hobby/InstagramCircle";
import { hobbies } from "@/content/hobby";
import s from "@/styles/shared.module.css";
import raised from "@/styles/raised.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Hobby",
  description: "My hobbies — Shelton LMS and 밥도둑.",
};

export default function HobbyPage() {
  return (
    <main className={`page ${styles.main}`}>
      <h1 className={s.h1}>Hobby</h1>
      <p className={s.lead}>
        My hobbies. Click instagram or pages if you are curious.
      </p>
      <div className={styles.list}>
        {hobbies.map((item) => (
          <div key={item.slug} className={s.entry}>
            <div className={styles.thumb}>
              <InstagramCircle
                src={`${item.photoDir}/avatar.jpg`}
                label={item.name}
                href={item.instagram}
                size={108}
              />
            </div>
            <div className={s.entryBody}>
              <div className={styles.nameRow}>
                <a
                  href={item.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className={`${raised.btn} ${styles.ig}`}
                  aria-label={`Instagram @${item.instagramHandle}`}
                >
                  <img src="/icons/instagram.svg" alt="" />
                </a>
                <Link href={`/hobby/${item.slug}`} className={styles.name}>
                  {item.name}
                </Link>
              </div>
              <p className={s.entryDesc}>{item.summary}</p>
              <div className={s.entryMeta}>
                <span>
                  {item.kind} · {item.year}
                </span>
              </div>
              <div className={s.entryLinks}>
                {item.url.startsWith("http") ? (
                  <a href={item.url} target="_blank" rel="noreferrer" className={raised.btn}>
                    {item.urlLabel} →
                  </a>
                ) : (
                  <Link href={item.url} className={raised.btn}>
                    {item.urlLabel} →
                  </Link>
                )}
              </div>
              {item.instagramNote ? (
                <a
                  href={item.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.igNote}
                >
                  {item.instagramNote}
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
