import clsx from "clsx";
import styles from "../videosection/VideoDetailModal.module.scss";
import Image from "~/components/Image";
import {
  CommentIcon,
  LikeIcon,
  PlusIcon,
  SaveIcon,
  ShareIcon,
} from "~/components/Icons";
export default function ActionBar() {
  return (
    <div className={clsx(styles.actionBarContainer)}>
      <div className={clsx(styles.divAvatarActionBar)}>
        <Image src="" alt="" className={clsx(styles.imgAvatar)} />
        <button className={clsx(styles.styleAvatarFollow)}>
          <PlusIcon width="1.4rem" height="1.4rem" />
        </button>
      </div>
      <button className={clsx(styles.btnActionItem)}>
        <span className={clsx(styles.iconStyle)}>
          <LikeIcon />
        </span>
        <strong>10</strong>
      </button>
      <button className={clsx(styles.btnActionItem)}>
        <span className={clsx(styles.iconStyle)}>
          <CommentIcon />
        </span>
        <strong>10</strong>
      </button>
      <button className={clsx(styles.btnActionItem)}>
        <span className={clsx(styles.iconStyle)}>
          <SaveIcon />
        </span>
        <strong>10</strong>
      </button>
      <button className={clsx(styles.btnActionItem)}>
        <span className={clsx(styles.iconStyle)}>
          <ShareIcon />
        </span>
        <strong>10</strong>
      </button>
    </div>
  );
}
