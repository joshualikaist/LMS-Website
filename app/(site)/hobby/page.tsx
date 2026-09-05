import type { Metadata } from "next";
import Link from "next/link";
import { BrowserPlaceholder } from "@/components/media/Placeholders";
import { hobbies } from "@/content/hobby";
import s from "@/styles/shared.module.css";
import raised from "@/styles/raised.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Hobby",
  description: "Personal side projects connected to joshualisky — Shelton LMS and 밥도둑.",
};

export default function HobbyPage() {
  return (
    <main className={`page ${styles.main}`}>
      <h1 className={s.h1}>Hobby</h1>
      <p className={s.lead}>
        Channels tied to Instagram @joshualisky. Each page below opens the live site.
      </p>
      <div className={styles.list}>
        {hobbies.map((item) => (
          <div key={item.slug} className={s.entry}>
            <div className={s.entryThumb}>
              <BrowserPlaceholder title={item.name} label={`HOBBY — ${item.handle}`} compact />
            </div>
            <div className={s.entryBody}>
              <Link href={`/hobby/${item.slug}`} className={`${raised.btn} ${raised.title}`}>
                {item.name}
              </Link>
              <p className={s.entryDesc}>{item.summary}</p>
              <div className={s.entryMeta}>
                <span>
                  {item.kind} · {item.year}
                </span>
              </div>
              <div className={s.entryLinks}>
                <Link href={`/hobby/${item.slug}`} className={raised.btn}>
                  Page
                </Link>
                <a href={item.url} target="_blank" rel="noreferrer" className={raised.btn}>
                  {item.urlLabel} →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
