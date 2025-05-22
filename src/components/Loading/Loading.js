import clsx from "clsx";
import styles from "./Loading.module.scss";
function Loading() {
  return (
    <div className={clsx(styles.overlay)}>
      <div className={clsx(styles.loader)}></div>
    </div>
  );
}

export default Loading;
