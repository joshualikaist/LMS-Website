"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ProfilePhoto.module.css";

type PhotoState = { exists: boolean; url: string | null; editable: boolean };

export default function ProfilePhoto({ alt }: { alt: string }) {
  const [photo, setPhoto] = useState<PhotoState>({ exists: false, url: null, editable: false });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/photo")
      .then((r) => r.json())
      .then(setPhoto)
      .catch(() => undefined);
  }, []);

  async function send(init: RequestInit) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/photo", init);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }
      setPhoto(data);
    } catch {
      setError("Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    void send({ method: "POST", body });
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.circle}>
        {photo.url ? (
          <img src={photo.url} alt={alt} className={styles.img} />
        ) : (
          <div className={styles.empty}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
              <circle cx="12" cy="8.5" r="4" />
              <path d="M4.5 20c0-4 3.4-6.5 7.5-6.5s7.5 2.5 7.5 6.5" strokeLinecap="round" />
            </svg>
            <span className={styles.emptyLabel}>PHOTO</span>
          </div>
        )}
      </div>

      {photo.editable && (
        <>
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.button}
              onClick={() => inputRef.current?.click()}
              disabled={busy}
            >
              {busy ? "SAVING…" : photo.exists ? "CHANGE PHOTO" : "UPLOAD PHOTO"}
            </button>
            {photo.exists && !busy && (
              <button type="button" className={styles.button} onClick={() => void send({ method: "DELETE" })}>
                REMOVE
              </button>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className={styles.hiddenInput}
            onChange={onPick}
          />
        </>
      )}

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
