"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { site } from "@/content/site";
import styles from "./SiteNav.module.css";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/notes", label: "Notes" },
  { href: "/cv", label: "CV" },
];

export default function SiteNav() {
  const pathname = usePathname();

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
                <Link key={l.href} href={l.href} className={active ? styles.active : styles.link}>
                  {l.label}
                </Link>
              );
            })}
            <a href={site.github} target="_blank" rel="noreferrer" className={styles.link}>
              GitHub ↗
            </a>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
