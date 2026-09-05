import Link from "next/link";
import { site } from "@/content/site";
import styles from "./SidebarDock.module.css";

type DockItem = {
  key: string;
  label: string;
  href?: string;
  icon: string;
  tone: string;
  external?: boolean;
};

export default function SidebarDock() {
  const items: DockItem[] = [];

  if (site.email) {
    items.push({ key: "email", label: "Email", href: `mailto:${site.email}`, icon: "/icons/gmail.svg", tone: "gmail" });
  }
  items.push({ key: "github", label: "GitHub", href: site.github, icon: "/icons/github.svg", tone: "github", external: true });
  if (site.linkedin) {
    items.push({ key: "linkedin", label: "LinkedIn", href: site.linkedin, icon: "/icons/linkedin.svg", tone: "linkedin", external: true });
  }
  if (site.instagram) {
    items.push({ key: "instagram", label: "Instagram", href: site.instagram, icon: "/icons/instagram.svg", tone: "instagram", external: true });
  }
  if (site.googleScholar) {
    items.push({ key: "scholar", label: "Google Scholar", href: site.googleScholar, icon: "/icons/googlescholar.svg", tone: "scholar", external: true });
  }
  if (site.orcid) {
    items.push({ key: "orcid", label: "ORCID", href: site.orcid, icon: "/icons/orcid.svg", tone: "orcid", external: true });
  }

  return (
    <nav className={styles.dock} aria-label="Profiles and pages">
      {items.map((item) => {
        const inner = (
          <>
            <span className={styles.face}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.icon} alt="" className={styles.glyph} />
            </span>
            <span className={styles.sr}>{item.label}</span>
          </>
        );

        if (item.external) {
          return (
            <a
              key={item.key}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className={`${styles.btn} ${styles[item.tone]}`}
              title={item.label}
              aria-label={item.label}
            >
              {inner}
            </a>
          );
        }

        return (
          <Link
            key={item.key}
            href={item.href ?? "/"}
            className={`${styles.btn} ${styles[item.tone]}`}
            title={item.label}
            aria-label={item.label}
          >
            {inner}
          </Link>
        );
      })}
    </nav>
  );
}
