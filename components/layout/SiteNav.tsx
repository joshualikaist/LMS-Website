"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import DigestLink from "@/components/links/DigestLink";
import { site } from "@/content/site";
import styles from "./SiteNav.module.css";

type NavItem = {
  id: string;
  href: string;
  label: string;
  mark?: boolean;
  digest?: boolean;
};

const ITEMS: NavItem[] = [
  { id: "home", href: "/", label: "ML", mark: true },
  { id: "research", href: "/work/motar", label: "Research" },
  { id: "hobby", href: "/hobby", label: "Hobby" },
  { id: "cv", href: "/cv", label: "CV" },
  { id: "trend", href: site.digest, label: "Trend", digest: true },
];

function isActive(pathname: string, item: NavItem) {
  if (item.id === "home") return pathname === "/";
  if (item.id === "research") return pathname.startsWith("/work") || pathname.startsWith("/research");
  if (item.id === "trend") {
    return pathname === site.digest || pathname.startsWith(`${site.digest}/`) || pathname.startsWith("/digest");
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export default function SiteNav() {
  const pathname = usePathname();
  const onPaper =
    pathname === "/" ||
    pathname === site.digest ||
    pathname.startsWith(`${site.digest}/`) ||
    pathname.startsWith("/digest");
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});
  const [focusId, setFocusId] = useState(() => ITEMS.find((item) => isActive(pathname, item))?.id ?? "home");
  const [pill, setPill] = useState({ x: 0, w: 0, ready: false });

  const activeId = ITEMS.find((item) => isActive(pathname, item))?.id ?? "home";

  const moveTo = useCallback((id: string) => {
    const nav = navRef.current;
    const el = itemRefs.current[id];
    if (!nav || !el) return;
    const navBox = nav.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    setPill({ x: box.left - navBox.left, w: box.width, ready: true });
    setFocusId(id);
  }, []);

  useLayoutEffect(() => {
    moveTo(activeId);
  }, [activeId, moveTo, pathname]);

  useLayoutEffect(() => {
    const onResize = () => moveTo(focusId);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [focusId, moveTo]);

  return (
    <header className={`${styles.float} ${onPaper ? styles.onHome : ""} no-print`}>
      <nav
        ref={navRef}
        className={styles.pill}
        aria-label="Primary navigation"
        onMouseLeave={() => moveTo(activeId)}
      >
        <span
          className={`${styles.slider} ${pill.ready ? styles.sliderOn : ""}`}
          style={{ transform: `translateX(${pill.x}px)`, width: pill.w }}
          aria-hidden="true"
        />
        {ITEMS.map((item) => {
          const on = focusId === item.id;
          const className = `${styles.item} ${item.mark ? styles.mark : ""} ${on ? styles.on : ""}`;
          const setRef = (node: HTMLElement | null) => {
            itemRefs.current[item.id] = node;
          };

          if (item.digest) {
            return (
              <span
                key={item.id}
                ref={setRef}
                className={className}
                onMouseEnter={() => moveTo(item.id)}
              >
                <DigestLink className={styles.hit} title={item.label}>
                  {item.label}
                </DigestLink>
              </span>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              ref={setRef}
              className={className}
              onMouseEnter={() => moveTo(item.id)}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
