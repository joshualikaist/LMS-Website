"use client";

import { useEffect, useRef } from "react";
import styles from "./DroneFly.module.css";

export default function DroneFly() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    video.playbackRate = reduce ? 0 : 0.9;
    const play = () => {
      void video.play().catch(() => undefined);
    };
    if (video.readyState >= 2) play();
    else video.addEventListener("loadeddata", play, { once: true });
  }, []);

  return (
    <div className={styles.wrap} aria-hidden="true">
      <video
        ref={videoRef}
        className={styles.video}
        src="/home/drone.mp4"
        muted
        loop
        playsInline
        preload="auto"
        poster="/home/sky.jpg"
      />
    </div>
  );
}
