import clsx from "clsx";
import styles from "./VideoItem.module.scss";
import { useRef, useState, forwardRef, useEffect } from "react";
import { MoreIcon, VolumeOffIcon, VolumeOnIcon } from "../Icons";
import { formatters } from "~/helpers";

const VideoItem = forwardRef(({ data }, ref) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [mute, setMute] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [prevVolume, setPrevVolume] = useState(volume);

  const progressRef = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.muted = mute;
      ref.current.volume = volume;
    }
  }, [mute, volume]);

  const handleProgressBarClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition =
      (e.clientX - progressBar.getBoundingClientRect().left) /
      progressBar.offsetWidth;
    const newTime = clickPosition * ref.current.duration;
    ref.current.currentTime = newTime;
    setCurrentTime(newTime);
    updateProgress();
  };

  const updateProgress = () => {
    if (ref.current && progressRef.current) {
      const progress = (ref.current.currentTime / ref.current.duration) * 100;
      progressRef.current.style.width = `${progress}%`;
    }
  };
  const handleProgressMouseDown = (e) => {
    const progressBar = e.currentTarget;

    const updateTime = (event) => {
      const clickPosition =
        (event.clientX - progressBar.getBoundingClientRect().left) /
        progressBar.offsetWidth;
      const newTime = clickPosition * ref.current.duration;
      ref.current.currentTime = newTime;
      setCurrentTime(newTime);
      updateProgress();
    };

    document.addEventListener("mousemove", updateTime);
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", updateTime);
    });
  };
  const handleTimeUpdate = () => {
    if (ref.current) {
      setCurrentTime(ref.current.currentTime);
      requestAnimationFrame(updateProgress);
    }
  };

  const handleLoadedMetadata = () => {
    if (ref.current) {
      setDuration(ref.current.duration);
    }
  };

  const handleAdjustVolume = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    if (newVolume > 0) {
      setMute(false);
    }
  };

  const handleToggleMute = () => {
    if (mute) {
      setVolume(prevVolume);
      setMute(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setMute(true);
    }
  };

  return (
    <div className={clsx(styles.container)}>
      <video
        style={
          data?.meta.resolutionX < data?.meta.resolutionY
            ? { height: "100%" }
            : { width: "100%" }
        }
        loop
        controls={false}
        src={data.fileUrl}
        ref={ref}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <div className={clsx(styles.mediaCardTop)}>
        <div
          className={clsx(styles.mediaCardTopLeft, { [styles.opacity]: mute })}
        >
          {!mute && (
            <div className={clsx(styles.volumeContainer)}>
              <input
                type="range"
                value={volume * 100}
                min={0}
                max={100}
                onChange={handleAdjustVolume}
                orient="horizontal"
              />
            </div>
          )}
          <div className={clsx(styles.volumeIcon)} onClick={handleToggleMute}>
            {mute ? (
              <VolumeOffIcon width="2.6rem" height="2.6rem" />
            ) : (
              <VolumeOnIcon width="2.6rem" height="2.6rem" />
            )}
          </div>
        </div>
        <div className={clsx(styles.mediaCardTopRight)}>
          <div className={clsx(styles.reportIcon)}>
            <MoreIcon width="2.6rem" height="2.6rem" />
          </div>
        </div>
      </div>
      <div className={clsx(styles.mediaCardBottom)}>
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
  );
});

VideoItem.displayName = "VideoItem";

export default VideoItem;
