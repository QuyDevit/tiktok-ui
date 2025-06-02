import { loadvideoDetail } from "~/services/videos/videoService";
import VideoDetailModal from "./components/videosection/VideoDetailModal";
import styles from "./VideoDetail.module.scss";
import clsx from "clsx";
import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { BackIcon, MusicIcon } from "~/components/Icons";
import VideoItem from "~/components/Video/VideoItem";
import SearchAccountItem from "~/components/SearchAccountItem";
import Comment from "./components/commentsection/Comment";
import { useSelector } from "react-redux";
import { selectUser } from "~/store/features/authSlice";

function VideoDetailContent({ videoId }) {
  const [videoDetail, setVideoDetail] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const currentUser = useSelector(selectUser);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchVideoDetail = async () => {
      try {
        const response = await loadvideoDetail(videoId);
        if (response.data) {
          setVideoDetail(response.data);
        } else {
          setErrorMessage("Không tìm thấy video!");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setErrorMessage("Không tìm thấy video!");
        } else {
          setErrorMessage("Lỗi khi tải video.");
        }
      }
    };

    fetchVideoDetail();
  }, [videoId]);

  useEffect(() => {
    if (videoDetail) {
      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.play();
      }
    }
  }, [videoDetail]);

  return (
    <main className={clsx(styles.container)}>
      {errorMessage ? (
        <p className={clsx(styles.errorMessage)}>{errorMessage}</p>
      ) : (
        <Link to="/" className={clsx(styles.backBtn)}>
          <BackIcon width="2rem" height="2rem" />
          <span>Quay lại</span>
        </Link>
      )}
      <div className={clsx(styles.wrapper)}>
        <div className={clsx(styles.divLeft)}>
          {videoDetail && (
            <div className={clsx(styles.mainContent)}>
              <VideoItem ref={videoRef} data={videoDetail} />
              <div className={clsx(styles.divDescription)}>
                <SearchAccountItem data={videoDetail?.user} />
                <div className={clsx(styles.divInfo)}>
                  <p>{videoDetail?.description}</p>
                  <p className={clsx(styles.tagAudio)}>
                    <MusicIcon width="1.6rem" height="1.6rem" />
                    <span className={clsx(styles.text)}>
                      Original sound - {videoDetail?.user?.nickname}
                    </span>
                  </p>
                </div>
              </div>
              <div className={clsx(styles.divCommentContainer)}>
                <Comment currentUser={currentUser} videoDetail={videoDetail} />
              </div>
            </div>
          )}
        </div>
        <div className={clsx(styles.divRight)}></div>
      </div>
    </main>
  );
}

export default function VideoDetail({ isModal = false }) {
  const { videoId } = useParams();

  if (isModal) {
    return <VideoDetailModal />;
  }

  return <VideoDetailContent videoId={videoId} />;
}
