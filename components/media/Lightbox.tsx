"use client";

import { useEffect, useId, useState, type KeyboardEvent, type ReactNode } from "react";
import styles from "./Lightbox.module.css";

export default function Lightbox({ children, label }: { children: ReactNode; label: string }) {
  const [open, setOpen] = useState(false);
  const labelId = useId();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function onTriggerKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!open && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      setOpen(true);
    }
  }

  return (
    <div className={styles.slot}>
      <div
        className={`${styles.stage} ${open ? styles.stageOpen : ""}`}
        role={open ? "dialog" : "button"}
        aria-modal={open || undefined}
        aria-labelledby={open ? labelId : undefined}
        aria-label={open ? undefined : `Expand ${label}`}
        tabIndex={open ? -1 : 0}
        onKeyDown={onTriggerKeyDown}
        onClick={(event) => {
          if (!open) setOpen(true);
          else if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        <div className={styles.media}>{children}</div>
        {!open && <span className={styles.hint}>EXPAND</span>}
        {open && (
          <>
            <span id={labelId} className={styles.srOnly}>
              {label}
            </span>
            <button type="button" className={styles.close} onClick={() => setOpen(false)}>
              CLOSE ×
            </button>
          </>
        )}
      </div>
    </div>
  );
}
