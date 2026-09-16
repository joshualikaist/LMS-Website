import type { Metadata } from "next";
import Link from "next/link";
import InstagramCircle from "@/components/hobby/InstagramCircle";
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
                  className={styles.ig}
                  aria-label={`Instagram @${item.instagramHandle}`}
                >
                  <img src="/icons/instagram.svg" alt="" />
                </a>
                <Link href={`/hobby/${item.slug}`} className={`${raised.btn} ${raised.title}`}>
                  {item.name}
                </Link>
              </div>
              <p className={s.entryDesc}>{item.summary}</p>
              <div className={s.entryMeta}>
                <span>
                  {item.kind} · {item.year}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
