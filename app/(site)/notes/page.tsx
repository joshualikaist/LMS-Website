import type { Metadata } from "next";
import { notes } from "@/content/notes";
import s from "@/styles/shared.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Notes",
  description: "Research, learning, and engineering notes — how the work gets thought through.",
};

export default function NotesPage() {
  return (
    <main className={`page ${styles.main}`}>
      <h1 className={s.h1}>Notes</h1>
      <p className={s.lead}>
        GitHub shows what got built; notes show how it was reasoned about. First notes are in
        preparation.
      </p>
      <div className={styles.list}>
        {notes.map((note) => (
          <div key={note.title} className={s.row}>
            <span className={s.rowDate}>{note.date}</span>
            <span className={s.rowBody}>
              <b>{note.title}</b>
              <span className={s.rowSub}>
                {note.kind} · {note.minutes} MIN
              </span>
            </span>
            <span className={`${s.statusChip} ${styles.chipMuted}`}>
              <span className={s.dotHollow} />
              IN PREPARATION
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
