import clsx from "clsx";
import styles from "./Discover.module.scss";
import { HashtagIcon, MusicIcon } from "../Icons";
function Discover() {
  return <div className={clsx(styles.discover)}>
    <p className={clsx(styles.title)}>Khám phá</p>
    <div className={clsx(styles.discoverList)}>
      <div className={clsx(styles.hashtag)}>
        <HashtagIcon width="1.4rem" height="1.4rem" className={clsx(styles.icon)}/>
        <p className={clsx(styles.text)}>Thể thao</p>
      </div>
      <div className={clsx(styles.hashtag)}>
        <HashtagIcon width="1.4rem" height="1.4rem" className={clsx(styles.icon)}/>
        <p className={clsx(styles.text)}>Giải trí</p>
      </div>
      <div className={clsx(styles.hashtag)}>
        <HashtagIcon width="1.4rem" height="1.4rem" className={clsx(styles.icon)}/>
        <p className={clsx(styles.text)}>Truyện tranh & hoạt hình</p>
      </div>
      <div className={clsx(styles.hashtag)}>
        <MusicIcon width="1.4rem" height="1.4rem" className={clsx(styles.icon)}/>
        <p className={clsx(styles.text)}>PICKLEBALL - Đỗ Phú Quí</p>
      </div>
      <div className={clsx(styles.hashtag)}>
        <HashtagIcon width="1.4rem" height="1.4rem" className={clsx(styles.icon)}/>
        <p className={clsx(styles.text)}>Chương trình</p>
      </div>
      <div className={clsx(styles.hashtag)}>
        <HashtagIcon width="1.4rem" height="1.4rem" className={clsx(styles.icon)}/>
        <p className={clsx(styles.text)}>Đời sống</p>
      </div>
      <div className={clsx(styles.hashtag)}>
        <MusicIcon width="1.4rem" height="1.4rem" className={clsx(styles.icon)}/>
        <p className={clsx(styles.text)}>Tái sinh - Tùng Dương</p>
      </div>
      <div className={clsx(styles.hashtag)}>
        <HashtagIcon width="1.4rem" height="1.4rem" className={clsx(styles.icon)}/>
        <p className={clsx(styles.text)}>Động vật</p>
      </div>
      <div className={clsx(styles.hashtag)}>
        <HashtagIcon width="1.4rem" height="1.4rem" className={clsx(styles.icon)}/>
        <p className={clsx(styles.text)}>Trò chơi</p>
      </div>
      <div className={clsx(styles.hashtag)}>
        <HashtagIcon width="1.4rem" height="1.4rem" className={clsx(styles.icon)}/>
        <p className={clsx(styles.text)}>Giáo dục</p>
      </div>
      <div className={clsx(styles.hashtag)}>
        <HashtagIcon width="1.4rem" height="1.4rem" className={clsx(styles.icon)}/>
        <p className={clsx(styles.text)}>Công nghệ</p>
      </div>
    </div>
  </div>;
}

export default Discover;
