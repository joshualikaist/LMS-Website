"use client";

import { usePathname } from "next/navigation";
import styles from "./SkyShell.module.css";

export default function SkyShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const home = pathname === "/";

  if (home) return <>{children}</>;

  return (
    <div data-sky className={styles.sky}>
      {children}
    </div>
  );
}
