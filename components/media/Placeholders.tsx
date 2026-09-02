import styles from "./Placeholders.module.css";
import Lightbox from "./Lightbox";

/*
 * Clearly-labeled stand-ins for real media. Swap each for the actual
 * simulation video / screenshot / photo by replacing the component usage —
 * the frame styles (.frame, .label) are reusable for <video> and <img>.
 */

type ArenaProps = {
  label: string;
  variant?: "hero" | "wide" | "cover";
  showLegend?: boolean;
  expandable?: boolean;
};

const ARENAS = {
  hero: {
    viewBox: "0 0 520 440",
    aspect: styles.aspectHero,
    obstacles: [
      [90, 120, 14], [180, 60, 10], [300, 150, 18], [420, 90, 12],
      [140, 260, 16], [250, 340, 12], [390, 290, 20], [60, 370, 12],
    ],
    target: "M480 60 C440 100 430 160 390 200 C360 230 330 290 302 348",
    uav: "M40 400 C100 370 120 310 170 300 C230 288 244 230 292 218 C336 208 330 290 302 348",
    intercept: [302, 348],
    uavStart: [40, 400],
    targetStart: null as number[] | null,
  },
  wide: {
    viewBox: "0 0 1280 620",
    aspect: styles.aspectWide,
    obstacles: [
      [120, 140, 22], [260, 80, 14], [340, 240, 26], [520, 120, 18],
      [600, 320, 30], [760, 180, 20], [880, 420, 24], [980, 100, 16],
      [1080, 260, 28], [200, 420, 20], [420, 480, 16], [720, 520, 18],
      [1160, 480, 22], [560, 540, 14],
    ],
    target: "M60 520 C180 480 260 360 380 340 C520 320 560 200 700 190 C820 180 900 240 1020 230",
    uav: "M1220 560 C1150 500 1100 480 1040 420 C980 360 1060 280 1020 230",
    intercept: [1020, 230],
    uavStart: [1220, 560],
    targetStart: [60, 520],
  },
  cover: {
    viewBox: "0 0 1280 560",
    aspect: styles.aspectCover,
    obstacles: [
      [160, 100, 20], [320, 200, 28], [480, 80, 14], [540, 340, 24],
      [700, 150, 18], [820, 380, 30], [940, 120, 16], [1060, 300, 22],
      [1180, 140, 14], [240, 420, 18], [420, 500, 14], [640, 480, 20],
      [1120, 480, 18],
    ],
    target: "M80 120 C200 160 260 300 400 320 C520 336 600 260 720 270 C840 280 880 340 960 330",
    uav: "M120 500 C260 480 380 440 500 430 C660 418 800 390 960 330",
    intercept: [960, 330],
    uavStart: [120, 500],
    targetStart: [80, 120],
  },
};

export function ArenaPlaceholder({
  label,
  variant = "wide",
  showLegend = false,
  expandable = true,
}: ArenaProps) {
  const a = ARENAS[variant];
  const [w, h] = a.viewBox.split(" ").slice(2).map(Number);
  const patternId = `grid-${variant}`;

  const media = (
    <div className={`${styles.frame} ${a.aspect}`}>
      <svg viewBox={a.viewBox} preserveAspectRatio="xMidYMid slice" className={styles.svg} aria-hidden="true">
        <defs>
          <pattern id={patternId} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="var(--grid)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={w} height={h} fill={`url(#${patternId})`} />
        <g fill="var(--obstacle)">
          {a.obstacles.map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
          ))}
        </g>
        <path d={a.target} stroke="var(--signal)" strokeWidth="2" strokeDasharray="6 6" fill="none" />
        <path d={a.uav} stroke="var(--accent)" strokeWidth="2.5" fill="none" />
        <circle cx={a.intercept[0]} cy={a.intercept[1]} r="12" stroke="var(--signal)" strokeWidth="2" fill="none" />
        <circle cx={a.intercept[0]} cy={a.intercept[1]} r="4.5" fill="var(--accent)" />
        <circle cx={a.uavStart[0]} cy={a.uavStart[1]} r="5" fill="none" stroke="var(--accent)" strokeWidth="2" />
        {a.targetStart && (
          <circle cx={a.targetStart[0]} cy={a.targetStart[1]} r="5" fill="none" stroke="var(--signal)" strokeWidth="2" />
        )}
      </svg>
      <div className={styles.label}>{label}</div>
      {showLegend && (
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={styles.swatchUav} />
            UAV
          </span>
          <span className={styles.legendItem}>
            <span className={styles.swatchTarget} />
            TARGET
          </span>
        </div>
      )}
    </div>
  );

  return expandable ? <Lightbox label={label}>{media}</Lightbox> : media;
}

export function BrowserPlaceholder({
  label,
  title,
  compact = false,
  expandable = true,
}: {
  label: string;
  title: string;
  compact?: boolean;
  expandable?: boolean;
}) {
  const media = (
    <div className={compact ? `${styles.browser} ${styles.browserCompact}` : styles.browser}>
      <div className={styles.browserBar}>
        <div className={styles.browserTitle}>{title}</div>
      </div>
      <div className={styles.browserBody}>
        <div className={styles.wireHead}>
          <div className={styles.wireLogo} />
          <div className={styles.wireNav}>
            <div className={styles.wireNavItem} />
            <div className={styles.wireNavItem} />
            <div className={styles.wireNavItem} />
            <div className={styles.wireNavItem} />
          </div>
        </div>
        <div className={styles.wireHero} />
        <div className={styles.wireCards}>
          <div className={styles.wireCard} />
          <div className={styles.wireCard} />
          <div className={styles.wireCard} />
        </div>
        <div className={styles.labelBottom}>{label}</div>
      </div>
    </div>
  );

  return expandable ? <Lightbox label={label}>{media}</Lightbox> : media;
}

export function PortraitPlaceholder({ label }: { label: string }) {
  return (
    <div className={`${styles.frame} ${styles.portrait}`}>
      <svg viewBox="0 0 300 400" preserveAspectRatio="none" className={styles.svg} aria-hidden="true">
        <path d="M0 0L300 400M300 0L0 400" stroke="var(--grid)" strokeWidth="1" />
      </svg>
      <div className={styles.labelBottom}>{label}</div>
    </div>
  );
}
