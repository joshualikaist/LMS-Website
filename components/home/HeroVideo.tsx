"use client";

import { useEffect, useRef } from "react";
import styles from "./HeroVideo.module.css";

const SRC = "/videos/drone-flight.mp4";
const POSTER = "/videos/drone-flight.jpg";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (motion.matches) {
        video.pause();
        return;
      }
      video.play().catch(() => {});
    };

    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, []);

  return (
    <div className={styles.pane} aria-hidden="true">
      <img className={styles.frame} src={POSTER} alt="" width={1920} height={1080} />
      <video
        ref={videoRef}
        className={`${styles.frame} ${styles.clip}`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={POSTER}
        tabIndex={-1}
      >
        <source src={SRC} type="video/mp4" />
      </video>
      <div className={styles.fade} />
    </div>
  );
}
