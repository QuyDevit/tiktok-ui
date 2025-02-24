import clsx from "clsx";
import styles from "./Loading.module.scss";
function Loading() {
  return (
    <div className={clsx(styles.overlay)}>
      <div class={clsx(styles.loader)}></div>
    </div>
  );
}

export default Loading;
