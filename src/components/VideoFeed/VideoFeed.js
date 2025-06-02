import clsx from "clsx";
import styles from "./VideoFeed.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { selectVideos, setCurrentIndex } from "~/store/features/videoListSlice";
import { useRef } from "react";
import {
  setIsOpenVideoDetail,
  setVideoDetail,
} from "~/store/features/videoDetailSlice";

function VideoFeed({ data, onHover }) {
  const dispatch = useDispatch();
  const videos = useSelector(selectVideos);
  const videoRef = useRef(null);
  const handleMouseEnter = () => {
    if (onHover) {
      onHover(videoRef.current);
    }
  };

  const handleOpenVideoDetail = () => {
    const videoIndex = videos.findIndex((video) => video.id === data.id);
    if (videoIndex !== -1) {
      dispatch(setCurrentIndex(videoIndex));
    }
    dispatch(setVideoDetail(data));
    dispatch(setIsOpenVideoDetail(true));
  };
  return (
    <div className={clsx(styles.container)}>
      <div
        className={clsx(styles.shortVideo)}
        onDoubleClick={handleOpenVideoDetail}
        onMouseEnter={handleMouseEnter}
      >
        <video
          loop
          controls={false}
          muted
          src={data?.fileUrl}
          ref={videoRef}
          className={clsx(styles.shortVideo)}
        />
      </div>
    </div>
  );
}

export default VideoFeed;
