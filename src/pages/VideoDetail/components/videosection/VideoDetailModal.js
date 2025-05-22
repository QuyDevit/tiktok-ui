import clsx from "clsx";
import styles from "./VideoDetailModal.module.scss";
import Comment from "../commentsection/Comment";
import ActionBar from "../actionsection/ActionBar";
import { useDispatch, useSelector } from "react-redux";
import {
  selectVideoDetail,
  setIsOpenVideoDetail,
} from "~/store/features/videoDetailSlice";
import { CloseIcon, DownIcon, UpIcon } from "~/components/Icons";
import VideoItem from "~/components/Video/VideoItem";
import { selectUser } from "~/store/features/authSlice";
import { useRef, useEffect } from "react";

export default function VideoDetailModal() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);
  const videoDetail = useSelector(selectVideoDetail);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play();
    }
  }, []);

  return (
    <div className={clsx(styles.container)}>
      <div className={clsx(styles.divPlayerContent)}>
        <div
          className={clsx(styles.left)}
          style={{
            aspectRatio:
              videoDetail?.meta.resolutionX < videoDetail?.meta.resolutionY
                ? "0.5625 / 1"
                : "1.77778 / 1",
            maxWidth:
              videoDetail?.meta.resolutionX < videoDetail?.meta.resolutionY
                ? "calc((0px - 16px + 100vh) * 0.5625)"
                : "min((0px - 16px + 100vh) * 1.77778, 60vw)",
          }}
        >
          <div className={clsx(styles.wrapper)}>
            <VideoItem data={videoDetail} ref={videoRef} />
          </div>
        </div>
        <div className={clsx(styles.right)}>
          <Comment currentUser={currentUser} />
        </div>
        <ActionBar />
        <div className={clsx(styles.divNavigation)}>
          <button className={clsx(styles.navigationBtn)}>
            <UpIcon width="2.5rem" height="2.5rem" />
          </button>
          <button className={clsx(styles.navigationBtn)}>
            <DownIcon width="2.5rem" height="2.5rem" />
          </button>
        </div>
        <button
          className={clsx(styles.closeBtn)}
          onClick={() => dispatch(setIsOpenVideoDetail(false))}
        >
          <CloseIcon width="2.5rem" height="2.5rem" />
        </button>
      </div>
    </div>
  );
}
