import styles from "./InstagramCircle.module.css";

type Props = {
  src: string;
  label: string;
  href: string;
  size?: number;
};

export default function InstagramCircle({ src, label, href, size = 92 }: Props) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={styles.link} title={label}>
      <span className={styles.ring} style={{ width: size, height: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.photo} src={src} alt="" />
      </span>
    </a>
  );
}
