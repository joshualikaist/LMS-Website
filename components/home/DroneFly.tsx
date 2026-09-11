import styles from "./DroneFly.module.css";

export default function DroneFly() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <img
        className={styles.photo}
        src="/home/field.png"
        alt=""
        width={1600}
        height={1067}
      />
      <div className={styles.mist} />
    </div>
  );
}
