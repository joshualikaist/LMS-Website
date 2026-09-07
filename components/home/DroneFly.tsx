"use client";

import { useEffect, useRef } from "react";
import styles from "./DroneFly.module.css";

const PROC_W = 720;
const PROC_H = 405;

function keySky(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const blueLead = b - r;
    const greenLead = g - r;
    if (blueLead > 22 && b > 72 && greenLead > -8) {
      data[i + 3] = 0;
    } else if (blueLead > 10 && b > 60) {
      data[i + 3] = Math.max(0, Math.round(255 * (1 - (blueLead - 10) / 14)));
    }
  }
}

export default function DroneFly() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const proc = document.createElement("canvas");
    proc.width = PROC_W;
    proc.height = PROC_H;
    const pctx = proc.getContext("2d", { willReadFrequently: true, alpha: true });
    if (!pctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let start = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawDrone = (time: number) => {
      if (video.readyState < 2) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      pctx.clearRect(0, 0, PROC_W, PROC_H);
      pctx.drawImage(video, 0, 0, PROC_W, PROC_H);
      const frame = pctx.getImageData(0, 0, PROC_W, PROC_H);
      keySky(frame.data);
      pctx.putImageData(frame, 0, 0);

      ctx.clearRect(0, 0, w, h);

      const t = reduce ? 0.4 : (time - start) / 1000;
      const depth = 0.5 + 0.5 * Math.sin(t * 0.55);
      const scale = (w < 720 ? 0.72 : 0.92) + depth * 0.22;
      const x = w * (w < 720 ? 0.5 : 0.66) + Math.sin(t * 0.7) * w * 0.07;
      const y = h * (w < 720 ? 0.28 : 0.4) + Math.cos(t * 0.52) * h * 0.08;
      const tilt = Math.sin(t * 0.8) * 0.14;
      const drawW = Math.min(w * 0.78, 920) * scale;
      const drawH = drawW * (PROC_H / PROC_W);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(tilt);
      ctx.scale(1 + Math.sin(t * 0.4) * 0.03, 1);
      ctx.filter = `blur(${(1 - depth) * 1.1}px)`;
      ctx.globalAlpha = 0.22 + depth * 0.12;
      ctx.fillStyle = "rgba(4, 10, 18, 0.55)";
      ctx.beginPath();
      ctx.ellipse(0, drawH * 0.28, drawW * 0.22, drawH * 0.06, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.filter = "none";
      ctx.globalAlpha = 0.88 + depth * 0.12;
      ctx.drawImage(proc, -drawW * 0.45, -drawH * 0.52, drawW, drawH);
      ctx.restore();
    };

    const loop = (stamp: number) => {
      if (!start) start = stamp;
      drawDrone(stamp);
      raf = window.requestAnimationFrame(loop);
    };

    const onReady = () => {
      video.playbackRate = reduce ? 0 : 0.85;
      void video.play().catch(() => undefined);
      if (!reduce) raf = window.requestAnimationFrame(loop);
      else drawDrone(0);
    };

    resize();
    window.addEventListener("resize", resize);
    if (video.readyState >= 2) onReady();
    else video.addEventListener("loadeddata", onReady, { once: true });

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      video.pause();
    };
  }, []);

  return (
    <div className={styles.wrap} aria-hidden="true">
      <video
        ref={videoRef}
        className={styles.source}
        src="/home/drone.mp4"
        muted
        loop
        playsInline
        preload="auto"
      />
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
