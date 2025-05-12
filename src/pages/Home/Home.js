import clsx from "clsx";
import styles from "./Home.module.scss";
import React, { useEffect, useState } from "react";
import Video from "~/components/Video";
import { useDispatch, useSelector } from "react-redux";
import { selectMute, setMute } from "~/store/features/muteVideoSlice";
import * as videoService from "~/services/videoService";
import { selectrefreshCount } from "~/store/features/homeSlice";
import routes, { pagesTitle } from "~/config/routes";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const [volume, setVolume] = useState(0.5);
  const [prevVolume, setPrevVolume] = useState(volume);
  const mute = useSelector(selectMute);

  const refreshCount = useSelector(selectrefreshCount);
  useEffect(() => {
    document.title = pagesTitle[routes.home];
  }, []);

  useEffect(() => {
    const saveMute = localStorage.getItem("mute");
    if (saveMute !== null) {
      dispatch(setMute(true));
    }
  }, []);

  const handleToggleMute = () => {
    if (mute) {
      setVolume(prevVolume);
      dispatch(setMute(false));
    } else {
      setPrevVolume(volume);
      setVolume(0);
      dispatch(setMute(true));
    }
  };
  useEffect(() => {
    const fetchApi = async () => {
      setIsLoading(true);
      const result = await videoService.loadvideo();
      setVideos(result);
      setIsLoading(false);
    };

    fetchApi();
  }, [page, refreshCount]);

  const handleAdjustVolume = (e) => {
    setVolume(e.target.value / 100);
  };
  return (
    <div className={clsx(styles.wrapper)}>
      {isLoading ? (
        <div className={clsx(styles.skeletonWrapper)}>
          <div className={clsx(styles.loading, "skeletonItem")}></div>
          <div className={clsx(styles.loading, "skeletonItem")}></div>
          <div className={clsx(styles.loading, "skeletonItem")}></div>
        </div>
      ) : (
        videos.map((video) => (
          <Video
            key={video.id}
            data={video}
            volume={volume}
            adjustVolume={handleAdjustVolume}
            mute={mute}
            toggleMuted={handleToggleMute}
          />
        ))
      )}
    </div>
  );
}
