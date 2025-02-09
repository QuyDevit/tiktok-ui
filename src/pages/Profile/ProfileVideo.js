import clsx from "clsx";
import styles from "./Profile.module.scss";
import { PlaceholderIcon } from "~/components/Icons";
function ProfileVideo({ videos =[], tab }) {
  return videos.length > 0 ? (
    <div>f1</div>
  ) : (
    <div className={clsx(styles.divEmptyContainer)}>
      <div className={clsx(styles.iconWrapper)}>
        <PlaceholderIcon width="4.4rem" height="4.4rem" />
      </div>
      <p className={clsx(styles.emptyTitle)}>{tab === 0 ? "Tải video đầu tiên của bạn lên" :tab === 1 ?"Bài đăng yêu thích":"Chưa thích video nào"}</p>
      <p className={clsx(styles.emptyNote)}>
      {tab === 0 ? "Video của bạn sẽ xuất hiện tại đây" :tab === 1 ?"Bài đăng bạn yêu thích sẽ xuất hiện tại đây.":"Những video bạn đã thích sẽ xuất hiện tại đây"}
        
      </p>
    </div>
  );
}

export default ProfileVideo;
