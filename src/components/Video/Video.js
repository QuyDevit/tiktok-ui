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
import { useEffect, useRef, useState } from "react";
import * as hepler from "~/helpers";

function Video({ data, mute, volume, adjustVolume, toggleMuted }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    videoRef.current.muted = mute;
    videoRef.current.volume = volume;
  }, [mute, volume]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

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
      { threshold: 0.75 }
    );

    observer.observe(videoElement);

    return () => {
      observer.unobserve(videoElement);
    };
  }, [videoRef]);

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
  return (
    <div className={clsx(styles.wrapper)}>
      <div>
        <AccountPreview data={data.user} offset={[135, 0]}>
          <Link to={""}>
            <Image
              src={data.user.avatar}
              alt="ok"
              className={clsx(styles.avatar)}
            />
          </Link>
        </AccountPreview>
      </div>
      <div className={clsx(styles.content)}>
        <div className={clsx(styles.header)}>
          <div className={clsx(styles.titleContent)}>
            <AccountPreview data={data.user} offset={[-112, 0]}>
              <Link to={""}>
                <div className={clsx(styles.author)}>
                  <h3 className={clsx(styles.nickname)}>
                    {data.user.nickname}
                  </h3>
                  <span className={clsx(styles.display)}>
                    {data.user.first_name} {data.user.last_name}
                  </span>
                  <span className={clsx(styles.dot)}>·</span>
                  <span className={clsx(styles.time)}>
                    {hepler.formatters.formatDate(data.created_at)}
                  </span>
                </div>
              </Link>
            </AccountPreview>
            <p className={clsx(styles.description)}>{data.description}</p>
            <p className={clsx(styles.tagAudio)}>
              <MusicIcon width="1.6rem" height="1.6rem" />
              <span className={clsx(styles.text)}>
                Original sound - {data.user.nickname}
              </span>
            </p>
          </div>
          <Button outline className={clsx(styles.followBtn)}>
            Theo dõi
          </Button>
        </div>
        <div className={clsx(styles.watchWrapper)}>
          <div className={clsx(styles.video)}>
            <video
              style={
                data?.meta.video.resolution_x < data?.meta.video.resolution_y
                  ? { width: "305px" }
                  : { width: "573px" }
              }
              loop
              controls={false}
              src={data.file_url}
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
                  <span>{hepler.formatters.formatTime(currentTime)}</span>
                  <span style={{ margin: "0 2px" }}>/</span>
                  <span>{hepler.formatters.formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={clsx(styles.actions)}>
            <div className={clsx(styles.actionBtn)}>
              <Button className={clsx(styles.iconWrapper)}>
                <LikeIcon />
              </Button>
              <p className={clsx(styles.value)}>124</p>
            </div>
            <div className={clsx(styles.actionBtn)}>
              <Button className={clsx(styles.iconWrapper)}>
                <CommentIcon />
              </Button>
              <p className={clsx(styles.value)}>124</p>
            </div>
            <div className={clsx(styles.actionBtn)}>
              <Button className={clsx(styles.iconWrapper)}>
                <SaveIcon />
              </Button>
              <p className={clsx(styles.value)}>124</p>
            </div>
            <div className={clsx(styles.actionBtn)}>
              <Button className={clsx(styles.iconWrapper)}>
                <ShareIcon />
              </Button>
              <p className={clsx(styles.value)}>124</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Video;
