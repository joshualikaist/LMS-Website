import styles from "./SystemDiagram.module.css";

function Box({ label, sub, dark = false }: { label: string; sub?: string; dark?: boolean }) {
  return (
    <div className={dark ? `${styles.box} ${styles.boxDark}` : styles.box}>
      <div className={dark ? `${styles.label} ${styles.labelLight}` : styles.label}>{label}</div>
      {sub && <div className={styles.sub}>{sub}</div>}
    </div>
  );
}

export default function SystemDiagram() {
  return (
    <div className={styles.scroller}>
      <div className={styles.diagram}>
        <div className={styles.grid3}>
          <div className={styles.colChain}>
            <Box label="CAMERA / RGB-D" sub="RGB-D STREAM" />
            <div className={styles.vline} />
            <Box label="TARGET TRACK" sub="DETECTION + TRACKING" />
            <div className={styles.vline} />
          </div>
          <div className={styles.colA}>
            <Box label="LIDAR" sub="4 × 72 BEAMS" />
          </div>
          <div className={styles.colB}>
            <Box label="EGO STATE" sub="ATTITUDE · VELOCITY" />
          </div>
          <div className={styles.colC}>
            <Box label="TARGET HISTORY" sub="TRACK BUFFER" />
          </div>
        </div>
        <svg width="760" height="56" viewBox="0 0 760 56" className={styles.merge} aria-hidden="true">
          <path
            d="M120 0V20 M380 0V20 M640 0V20 M120 20H640 M380 20V46"
            stroke="var(--ink)"
            strokeWidth="1.5"
            fill="none"
          />
          <path d="M374 46L386 46L380 56Z" fill="var(--ink)" />
        </svg>
        <div className={styles.mid}>
          <Box label="STRUCTURED OBSERVATION" sub="898-D · 17 TOKENS" />
        </div>
        <div className={styles.vline} />
        <div className={styles.mid}>
          <Box label="TRANSFORMER POLICY" sub="10 Hz" />
        </div>
        <div className={styles.vline} />
        <div className={styles.mid}>
          <Box label="BODY-FRAME COMMAND" sub="BOUNDED" />
        </div>
        <div className={styles.vline} />
        <div className={styles.mid}>
          <Box label="FLIGHT CONTROLLER" />
        </div>
        <div className={styles.vline} />
        <div className={styles.mid}>
          <Box label="UAV" sub="RIGID-BODY PHYSICS · 100 Hz" dark />
        </div>
      </div>
    </div>
  );
}
