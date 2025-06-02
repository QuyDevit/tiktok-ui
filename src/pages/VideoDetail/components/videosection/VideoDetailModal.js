import clsx from "clsx";
import styles from "./VideoDetailModal.module.scss";
import Comment from "../commentsection/Comment";
import ActionBar from "../actionsection/ActionBar";
import { useDispatch, useSelector } from "react-redux";
import {
  selectVideoDetail,
  setIsOpenVideoDetail,
  setVideoDetail,
} from "~/store/features/videoDetailSlice";
import {
  selectVideos,
  selectCurrentIndex,
  selectHasMore,
  selectSearchAfter,
  setCurrentIndex,
  appendVideos,
  setHasMore,
  setSearchAfter,
} from "~/store/features/videoListSlice";
import { CloseIcon, DownIcon, UpIcon } from "~/components/Icons";
import VideoItem from "~/components/Video/VideoItem";
import { selectUser } from "~/store/features/authSlice";
import { useRef, useEffect, useState } from "react";
import { loadvideo } from "~/services/videos/videoService";
import config from "~/config";

export default function VideoDetailModal() {
  const dispatch = useDispatch();
  const [isMuted, setIsMuted] = useState(true);

  const currentUser = useSelector(selectUser);
  const videoDetail = useSelector(selectVideoDetail);
  const videos = useSelector(selectVideos);
  const currentIndex = useSelector(selectCurrentIndex);
  const hasMore = useSelector(selectHasMore);
  const searchAfter = useSelector(selectSearchAfter);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.play();
    }
  }, [videoDetail, isMuted]);

  const loadMoreVideos = async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    const result = await loadvideo("for-you", searchAfter);
    dispatch(setHasMore(result.hasMore));
    dispatch(setSearchAfter(result.nextSearchAfter));
    dispatch(appendVideos(result.data));
    setIsLoadingMore(false);
  };

  const handleNavigate = async (direction) => {
    if (videoRef.current) {
      setIsMuted(videoRef.current.muted);
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < videos.length) {
      dispatch(setCurrentIndex(newIndex));
      dispatch(setVideoDetail(videos[newIndex]));

      const newUrl = config.routes.videoDetail.replace(
        ":videoId",
        videos[newIndex].id
      );
      window.history.replaceState(
        {
          fromModal: true,
          previousUrl: window.history.state?.previousUrl || "/",
          videoId: videos[newIndex].id,
        },
        "",
        newUrl
      );
    } else if (direction === "down" && hasMore) {
      await loadMoreVideos();
      if (videos.length > currentIndex + 1) {
        dispatch(setCurrentIndex(currentIndex + 1));
        dispatch(setVideoDetail(videos[currentIndex + 1]));

        const newUrl = config.routes.videoDetail.replace(
          ":videoId",
          videos[currentIndex + 1].id
        );
        window.history.replaceState(
          {
            fromModal: true,
            previousUrl: window.history.state?.previousUrl || "/",
            videoId: videos[currentIndex + 1].id,
          },
          "",
          newUrl
        );
      }
    }
  };

  const handleCloseModal = () => {
    dispatch(setIsOpenVideoDetail(false));

    // Quay về URL trước đó
    if (window.history.state?.fromModal && window.history.state?.previousUrl) {
      window.history.pushState(null, "", window.history.state.previousUrl);
    } else {
      // Fallback về home nếu không có previous URL
      window.history.pushState(null, "", "/");
    }
  };
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
            <VideoItem data={videoDetail} ref={videoRef} isModal />
          </div>
        </div>
        <div className={clsx(styles.right)}>
          <Comment
            currentUser={currentUser}
            videoDetail={videoDetail}
            isModal
          />
        </div>
        <ActionBar currentUser={currentUser} videoDetail={videoDetail} />
        <div className={clsx(styles.divNavigation)}>
          <button
            className={clsx(styles.navigationBtn)}
            onClick={() => handleNavigate("up")}
            disabled={currentIndex === 0}
            style={
              currentIndex === 0 ? { opacity: 0.5, cursor: "default" } : {}
            }
          >
            <UpIcon width="2.5rem" height="2.5rem" />
          </button>
          <button
            className={clsx(styles.navigationBtn)}
            onClick={() => handleNavigate("down")}
            disabled={currentIndex === videos.length - 1 && !hasMore}
            style={
              currentIndex === videos.length - 1 && !hasMore
                ? { opacity: 0.5, cursor: "default" }
                : {}
            }
          >
            <DownIcon width="2.5rem" height="2.5rem" />
          </button>
        </div>
        <button className={clsx(styles.closeBtn)} onClick={handleCloseModal}>
          <CloseIcon width="2.5rem" height="2.5rem" />
        </button>
      </div>
    </div>
  );
}
