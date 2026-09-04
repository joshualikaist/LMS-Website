import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNote, publishedNotes } from "@/content/notes";
import s from "@/styles/shared.module.css";
import styles from "../page.module.css";
import noteStyles from "./page.module.css";

type Params = { slug: string };

export function generateStaticParams() {
  return publishedNotes()
    .filter((note): note is typeof note & { slug: string } => Boolean(note.slug))
    .map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return { title: "Notes" };
  return {
    title: note.title,
    description: `${note.kind} — ${note.title}`,
  };
}

export default async function NotePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note || !note.body) notFound();

  return (
    <main className={`page ${styles.main}`}>
      <p className={s.kicker}>{note.kind}</p>
      <h1 className={s.h1}>{note.title}</h1>
      <p className={s.lead}>
        {note.date} · {note.minutes} min
      </p>
      <div className={noteStyles.article}>
        {note.body.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>
      <p className={noteStyles.back}>
        <Link href="/notes">← All notes</Link>
        <Link href="/work/motar">MOTAR case study</Link>
      </p>
    </main>
  );
}
