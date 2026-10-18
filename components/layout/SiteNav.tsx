"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import styles from "./SiteNav.module.css";

type NavItem = {
  id: string;
  href: string;
  label: string;
};

const ITEMS: NavItem[] = [
  { id: "home", href: "/", label: "Minseok Li" },
  { id: "research", href: "/research", label: "Research" },
  { id: "notes", href: "/notes", label: "Notes" },
  { id: "cv", href: "/cv", label: "CV" },
  { id: "hobby", href: "/hobby", label: "Hobby" },
  { id: "trend", href: site.digest, label: "Trend" },
];

function isActive(pathname: string, item: NavItem) {
  if (item.id === "home") return pathname === "/";
  if (item.id === "research") return pathname.startsWith("/work") || pathname.startsWith("/research");
  if (item.id === "trend") {
    return (
      pathname === site.digest ||
      pathname.startsWith(`${site.digest}/`) ||
      pathname.startsWith("/digest")
    );
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export default function SiteNav() {
  const pathname = usePathname();
  const onTrend =
    pathname === site.digest ||
    pathname.startsWith(`${site.digest}/`) ||
    pathname.startsWith("/digest");
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});
  const activeId = ITEMS.find((item) => isActive(pathname, item))?.id ?? null;
  const [focusId, setFocusId] = useState(activeId);
  const [pill, setPill] = useState({ x: 0, w: 0, ready: false });

  const moveTo = useCallback((id: string | null) => {
    const nav = navRef.current;
    const el = id ? itemRefs.current[id] : null;
    setFocusId(id);
    if (!nav || !el) {
      setPill((p) => ({ ...p, ready: false }));
      return;
    }
    const navBox = nav.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    setPill({ x: box.left - navBox.left, w: box.width, ready: true });
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
    <header
      className={`${styles.float} ${pathname === "/" || onTrend ? styles.onHome : ""} ${pathname === "/" ? styles.overHero : ""} no-print`}
    >
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
        {ITEMS.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            ref={(node: HTMLElement | null) => {
              itemRefs.current[item.id] = node;
            }}
            className={`${styles.item} ${item.id === "home" ? styles.home : ""} ${focusId === item.id ? styles.on : ""}`}
            aria-current={activeId === item.id ? "page" : undefined}
            onMouseEnter={() => moveTo(item.id)}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
