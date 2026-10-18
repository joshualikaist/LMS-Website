import styles from "./InstagramCircle.module.css";

type Props = {
  src: string;
  label: string;
  href: string;
  size?: 92 | 108 | 128;
};

const SIZE_CLASS = { 92: styles.s92, 108: styles.s108, 128: styles.s128 } as const;

export default function InstagramCircle({ src, label, href, size = 92 }: Props) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={styles.link} title={label}>
      <span className={`${styles.ring} ${SIZE_CLASS[size]}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.photo} src={src} alt="" />
      </span>
    </a>
  );
}
