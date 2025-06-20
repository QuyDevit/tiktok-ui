import clsx from "clsx";
import styles from "./PostItem.module.scss";
import { Link } from "react-router-dom";
import Image from "../Image";
import { useRef } from "react";
import { formatters } from "~/helpers";
import { useDispatch, useSelector } from "react-redux";
import { selectVideos, setCurrentIndex } from "~/store/features/videoListSlice";
import {
  setIsOpenVideoDetail,
  setVideoDetail,
} from "~/store/features/videoDetailSlice";

function PostItem({ data, onHover }) {
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
      <div className={clsx(styles.description)}>
        <div className={clsx(styles.divCaption)}>{data?.description}</div>
        <div className={clsx(styles.divSubInfo)}>
          <Link
            to={`/@${data?.user.nickname}`}
            className={clsx(styles.linkAccount)}
          >
            <Image
              src={data?.user.avatar}
              alt={data?.user.fullName}
              className={clsx(styles.imgAvatar)}
            />
            <span className={clsx(styles.nickname)}>{data?.user.nickname}</span>
          </Link>
          <div className={clsx(styles.divTime)}>
            {formatters.formatShortDate(data?.publishedAt)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostItem;
