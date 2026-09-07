"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DigestLink from "@/components/links/DigestLink";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { site } from "@/content/site";
import raised from "@/styles/raised.module.css";
import styles from "./SiteNav.module.css";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/notes", label: "Notes" },
  { href: "/hobby", label: "Hobby" },
  { href: "/cv", label: "CV" },
];

const HOME_LINKS = [
  { href: "/notes", label: "Notes" },
  { href: "/work/motar", label: "Research" },
  { href: "/hobby", label: "Hobby" },
  { href: "/cv", label: "CV" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const home = pathname === "/";
  const digestActive =
    !site.digestIsExternal &&
    (pathname === site.digest || pathname.startsWith(`${site.digest}/`) || pathname.startsWith("/digest"));

  if (home) {
    return (
      <header className={`${styles.float} no-print`}>
        <nav className={styles.pill} aria-label="Primary navigation">
          <Link href="/" className={styles.mark} aria-label="Home">
            ML
          </Link>
          {HOME_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={styles.pillLink}>
              {l.label}
            </Link>
          ))}
          <DigestLink className={styles.pillCta}>Trend</DigestLink>
        </nav>
      </header>
    );
  }

  return (
    <header className={`${styles.bar} no-print`}>
      <div className={`page ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          Minseok Li
        </Link>
        <div className={styles.controls}>
          <nav className={styles.links} aria-label="Primary navigation">
            {LINKS.map((l) => {
              const active =
                l.href === "/" ? pathname === "/" : pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <Link key={l.href} href={l.href} className={`${raised.btn} ${active ? raised.on : ""}`}>
                  {l.label}
                </Link>
              );
            })}
            <DigestLink className={`${raised.btn} ${digestActive ? raised.on : ""}`}>Trend</DigestLink>
            <a href={site.github} target="_blank" rel="noreferrer" className={`${raised.btn} ${styles.github}`}>
              GitHub ↗
            </a>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
