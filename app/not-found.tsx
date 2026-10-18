import type { Metadata } from "next";
import Link from "next/link";
import s from "@/styles/shared.module.css";
import raised from "@/styles/raised.module.css";
import styles from "./not-found.module.css";

export const metadata: Metadata = { title: "Page not found" };

// Replaces Next.js's built-in 404, which positions itself with inline <style> and style="" attributes that
// the site's Content-Security-Policy (style-src 'self') correctly refuses.
export default function NotFound() {
  return (
    <main className={`page ${styles.main}`}>
      <p className={s.kicker}>404</p>
      <h1 className={s.h1}>This page could not be found.</h1>
      <p className={s.lead}>The address may be mistyped, or the page may have moved.</p>
      <div className={styles.actions}>
        <Link href="/" className={raised.btn}>
          ← Back to home
        </Link>
        <Link href="/research" className={raised.btn}>
          Research
        </Link>
      </div>
    </main>
  );
}
