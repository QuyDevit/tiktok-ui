import clsx from "clsx";
import styles from "./Video.module.scss";
import { Link } from "react-router-dom";
import Image from "../Image";
import Button from "../Button";
import {
  CommentIcon,
  LikeIcon,
  MusicIcon,
  PauseIcon,
  PlayIcon,
  SaveIcon,
  ShareIcon,
  VolumeOffIcon,
  VolumeOnIcon,
} from "../Icons";
import AccountPreview from "../SuggestedAccount/AccountPreview";
import { useEffect, useRef, useState, useMemo } from "react";
import { formatters } from "~/helpers";
import { likevideo } from "~/services/videos/videoService";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsOpenVideoDetail,
  setVideoDetail,
  selectIsOpenVideoDetail,
} from "~/store/features/videoDetailSlice";
import { useDebounceCallback } from "~/hooks/useDebouncedCallback";
import { followUser } from "~/services/users/followUser";
import {
  setFollowedUser,
  selectFollowedUsers,
} from "~/store/features/followSlice";
import { selectVideos, setCurrentIndex } from "~/store/features/videoListSlice";
import config from "~/config";

function Video({ currentUser, data, mute, volume, adjustVolume, toggleMuted }) {
  const dispatch = useDispatch();
  const isOpenVideoDetail = useSelector(selectIsOpenVideoDetail);
  const followedUsers = useSelector(selectFollowedUsers);
  const videos = useSelector(selectVideos);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(data?.isLiked ?? false);
  const [likesCount, setLikesCount] = useState(data?.likesCount ?? 0);
  const isFollow =
    followedUsers[data?.user?.id] ?? data?.user?.isFollowed ?? false;

  const videoRef = useRef(null);
  const progressRef = useRef(null);

  const formattedDate = useMemo(() => {
    return data?.publishedAt ? formatters.formatDate(data.publishedAt) : "";
  }, [data?.publishedAt]);

  useEffect(() => {
    videoRef.current.muted = mute;
    videoRef.current.volume = volume;
  }, [mute, volume]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement || isOpenVideoDetail) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (videoElement.paused) {
            videoElement.currentTime = 0;
            setTimeout(() => {
              requestAnimationFrame(() => {
                videoElement
                  .play()
                  .then(() => {
                    setIsPlaying(true);
                  })
                  .catch((error) => {
                    console.error("Play error:", error);
                  });
              });
            }, 100);
          }
        } else {
          if (!videoElement.paused) {
            videoElement.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.76 }
    );

    observer.observe(videoElement);

    return () => {
      observer.unobserve(videoElement);
    };
  }, [videoRef, isOpenVideoDetail]);

  useEffect(() => {
    if (isOpenVideoDetail && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isOpenVideoDetail]);

  const handleTogglePlayVideo = () => {
    const videoElement = videoRef.current;

    if (videoElement.paused) {
      videoElement.play();
      setIsPlaying(true);
    } else {
      videoElement.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      requestAnimationFrame(updateProgress);
    }
  };
  const handleProgressMouseDown = (e) => {
    const progressBar = e.currentTarget;

    const updateTime = (event) => {
      const clickPosition =
        (event.clientX - progressBar.getBoundingClientRect().left) /
        progressBar.offsetWidth;
      const newTime = clickPosition * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      updateProgress();
    };

    document.addEventListener("mousemove", updateTime);
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", updateTime);
    });
  };
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  const handleProgressBarClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition =
      (e.clientX - progressBar.getBoundingClientRect().left) /
      progressBar.offsetWidth;
    const newTime = clickPosition * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    updateProgress();
  };

  const updateProgress = () => {
    if (videoRef.current && progressRef.current) {
      const progress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      progressRef.current.style.width = `${progress}%`;
    }
  };
  const debouncedLikeVideo = useDebounceCallback(async () => {
    const result = await likevideo(data?.id);
    setLikesCount(result.data);
  }, 500);

  const likeVideo = () => {
    if (!currentUser) return;

    setIsLiked((prev) => !prev);
    debouncedLikeVideo();
  };
  const debouncedFollowUser = useDebounceCallback(async () => {
    await followUser(data?.user.id);
    dispatch(setFollowedUser({ userId: data?.user.id, isFollowed: !isFollow }));
  }, 500);

  const handleFollowUser = () => {
    if (!currentUser) return;
    debouncedFollowUser();
  };
  const handleOpenVideoDetail = () => {
    const videoIndex = videos.findIndex((video) => video.id === data.id);
    if (videoIndex !== -1) {
      dispatch(setCurrentIndex(videoIndex));
    }
    dispatch(setVideoDetail(data));
    dispatch(setIsOpenVideoDetail(true));

    const newUrl = config.routes.videoDetail.replace(":videoId", data.id);
    window.history.pushState(
      {
        fromModal: true,
        previousUrl: window.location.pathname,
        videoId: data.id,
      },
      "",
      newUrl
    );
  };
  return (
    <div className={clsx(styles.wrapper)}>
      <div>
        <AccountPreview data={data?.user} offset={[135, 0]}>
          <Link to={`@${data?.user.nickname}`}>
            <Image
              src={data?.user?.avatar}
              alt="ok"
              className={clsx(styles.avatar)}
            />
          </Link>
        </AccountPreview>
      </div>
      <div className={clsx(styles.content)}>
        <div className={clsx(styles.header)}>
          <div className={clsx(styles.titleContent)}>
            <AccountPreview data={data?.user} offset={[-112, 0]}>
              <Link to={`@${data?.user?.nickname}`}>
                <div className={clsx(styles.author)}>
                  <h3 className={clsx(styles.nickname)}>
                    {data?.user?.nickname}
                  </h3>
                  <span className={clsx(styles.display)}>
                    {data?.user?.fullName}
                  </span>
                  <span className={clsx(styles.dot)}>·</span>
                  <span className={clsx(styles.time)}>{formattedDate}</span>
                </div>
              </Link>
            </AccountPreview>
            <p className={clsx(styles.description)}>{data?.description}</p>
            <p className={clsx(styles.tagAudio)}>
              <MusicIcon width="1.6rem" height="1.6rem" />
              <span className={clsx(styles.text)}>
                Original sound - {data?.user?.nickname}
              </span>
            </p>
          </div>
          {currentUser && data?.user?.id !== currentUser.id && (
            <Button
              primary={!isFollow}
              outline={isFollow}
              className={clsx(styles.followBtn)}
              onClick={handleFollowUser}
            >
              {isFollow ? "Đã theo dõi" : "Theo dõi"}
            </Button>
          )}
        </div>
        <div className={clsx(styles.watchWrapper)}>
          <div
            className={clsx(styles.video)}
            onDoubleClick={handleOpenVideoDetail}
          >
            <video
              style={
                data?.meta?.resolutionX < data?.meta?.resolutionY
                  ? { width: "305px" }
                  : { width: "573px" }
              }
              loop
              controls={false}
              src={data?.fileUrl}
              ref={videoRef}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            />
            <div className={clsx(styles.control)}>
              <div className={clsx(styles.controlAction)}>
                <div
                  className={clsx(styles.playBtn)}
                  onClick={handleTogglePlayVideo}
                >
                  {isPlaying ? (
                    <PauseIcon width="2rem" height="2rem" />
                  ) : (
                    <PlayIcon width="2rem" height="2rem" />
                  )}
                </div>
                <div
                  className={clsx(styles.volumeBtn, {
                    [styles.opacity]: mute,
                  })}
                >
                  {!mute && (
                    <div className={clsx(styles.volumeContainer)}>
                      <input
                        type="range"
                        value={volume * 100}
                        min={0}
                        max={100}
                        onChange={adjustVolume}
                        orient="vertical"
                      />
                    </div>
                  )}
                  <div
                    className={clsx(styles.volumeIcon)}
                    onClick={toggleMuted}
                  >
                    {mute ? (
                      <VolumeOffIcon width="2.6rem" height="2.6rem" />
                    ) : (
                      <VolumeOnIcon width="2.6rem" height="2.6rem" />
                    )}
                  </div>
                </div>
              </div>
              <div className={clsx(styles.controlTime)}>
                <div
                  className={clsx(styles.progressBar)}
                  onClick={handleProgressBarClick}
                  onMouseDown={handleProgressMouseDown}
                >
                  <div className={clsx(styles.currentTimeTrackContainer)}>
                    <div
                      className={clsx(styles.currentTimeTrackLine)}
                      ref={progressRef}
                    ></div>
                  </div>
                </div>
                <div className={clsx(styles.timeValue)}>
                  <span>{formatters.formatTime(currentTime)}</span>
                  <span style={{ margin: "0 2px" }}>/</span>
                  <span>{formatters.formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={clsx(styles.actions)}>
            <div className={clsx(styles.actionBtn)}>
              <Button
                className={clsx(styles.iconWrapper, {
                  [styles.liked]: isLiked,
                })}
                onClick={likeVideo}
              >
                <LikeIcon />
              </Button>
              <p className={clsx(styles.value)}>{likesCount}</p>
            </div>
            <div className={clsx(styles.actionBtn)}>
              <Button
                className={clsx(styles.iconWrapper)}
                onClick={handleOpenVideoDetail}
              >
                <CommentIcon />
              </Button>
              <p className={clsx(styles.value)}>{data?.commentsCount}</p>
            </div>
            <div className={clsx(styles.actionBtn)}>
              <Button className={clsx(styles.iconWrapper)}>
                <SaveIcon />
              </Button>
              <p className={clsx(styles.value)}>0</p>
            </div>
            <div className={clsx(styles.actionBtn)}>
              <Button className={clsx(styles.iconWrapper)}>
                <ShareIcon />
              </Button>
              <p className={clsx(styles.value)}>{data?.sharesCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Video;
