"use client";

import { useEffect, useRef } from "react";
import styles from "./DroneFly.module.css";

export default function DroneFly() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const restX = 8;
    const restY = -16;
    const onMove = (event: PointerEvent) => {
      const yaw = restY + (event.clientX / window.innerWidth - 0.5) * 28;
      const pitch = restX + (0.5 - event.clientY / window.innerHeight) * 18;
      card.style.transform = `rotateX(${pitch}deg) rotateY(${yaw}deg)`;
    };
    card.style.transform = `rotateX(${restX}deg) rotateY(${restY}deg)`;
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.stage3d}>
        <div ref={cardRef} className={styles.card}>
          <img className={styles.photo} src="/home/mini.png" alt="" width={870} height={870} />
        </div>
      </div>
    </div>
  );
}
