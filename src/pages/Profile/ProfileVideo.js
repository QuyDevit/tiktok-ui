import clsx from "clsx";
import styles from "./Profile.module.scss";
import { PlaceholderIcon } from "~/components/Icons";
import VideoFeed from "~/components/VideoFeed";
import { useState } from "react";

function ProfileVideo({ videos = [], tab }) {
  const [activeVideo, setActiveVideo] = useState(null);

  const handleHover = (video) => {
    if (activeVideo && activeVideo !== video) {
      activeVideo.pause();
      activeVideo.currentTime = 0;
    }
    setActiveVideo(video);
    video.play();
  };
  return videos.length > 0 ? (
    <div className={clsx(styles.divVideoFeed)}>
      {videos.map((video) => (
        <VideoFeed key={`${video.id}`} data={video} onHover={handleHover} />
      ))}
    </div>
  ) : (
    <div className={clsx(styles.divEmptyContainer)}>
      <div className={clsx(styles.iconWrapper)}>
        <PlaceholderIcon width="4.4rem" height="4.4rem" />
      </div>
      <p className={clsx(styles.emptyTitle)}>
        {tab === 0
          ? "Chưa có video nào được đăng"
          : tab === 1
          ? "Bài đăng yêu thích"
          : "Chưa thích video nào"}
      </p>
      <p className={clsx(styles.emptyNote)}>
        {tab === 0
          ? "Video của người dùng sẽ xuất hiện tại đây"
          : tab === 1
          ? "Bài đăng người dùng yêu thích sẽ xuất hiện tại đây."
          : "Những video người dùng đã thích sẽ xuất hiện tại đây"}
      </p>
    </div>
  );
}

export default ProfileVideo;
