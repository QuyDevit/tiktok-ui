import clsx from "clsx";
import styles from "./Home.module.scss";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Video from "~/components/Video";
import { useDispatch, useSelector } from "react-redux";
import { selectMute, setMute } from "~/store/features/muteVideoSlice";
import { loadvideo } from "~/services/videos/videoService";
import {
  selectVideos,
  selectHasMore,
  selectSearchAfter,
  appendVideos,
  setHasMore,
  setSearchAfter,
  setVideos,
} from "~/store/features/videoListSlice";
import { selectrefreshCount } from "~/store/features/homeSlice";
import routes, { pagesTitle } from "~/config/routes";
import { selectUser } from "~/store/features/authSlice";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const dispatch = useDispatch();
  const [volume, setVolume] = useState(0.5);
  const [prevVolume, setPrevVolume] = useState(volume);
  const mute = useSelector(selectMute);
  const lastVideoRef = useRef(null);
  const loadingRef = useRef(false);

  const videos = useSelector(selectVideos);
  const hasMore = useSelector(selectHasMore);
  const searchAfter = useSelector(selectSearchAfter);

  const refreshCount = useSelector(selectrefreshCount);
  const currentUser = useSelector(selectUser);

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
    const fetchInitialVideos = async () => {
      setIsLoading(true);
      try {
        const result = await loadvideo("for-you");
        dispatch(setVideos(result.data));
        dispatch(setHasMore(result.hasMore));
        dispatch(setSearchAfter(result.nextSearchAfter));
      } catch (error) {
        console.error("Error loading initial videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialVideos();
  }, [refreshCount, dispatch]);

  const loadMoreVideos = useCallback(async () => {
    if (loadingRef.current || !hasMore || isLoadingMore) {
      return;
    }

    loadingRef.current = true;
    setIsLoadingMore(true);

    try {
      const result = await loadvideo("for-you", searchAfter);

      if (result.data && result.data.length > 0) {
        dispatch(appendVideos(result.data));
        dispatch(setHasMore(result.hasMore));
        dispatch(setSearchAfter(result.nextSearchAfter));
      }
    } catch (error) {
      console.error("Error loading more videos:", error);
    } finally {
      setIsLoadingMore(false);
      loadingRef.current = false;
    }
  }, [hasMore, isLoadingMore, searchAfter, dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const isNearBottom = scrollTop + windowHeight >= documentHeight - 200;

      if (isNearBottom && hasMore && !loadingRef.current) {
        loadMoreVideos();
      }
    };

    let timeoutId;
    const throttledScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        handleScroll();
        timeoutId = null;
      }, 100);
    };

    window.addEventListener("scroll", throttledScroll);

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [hasMore, loadMoreVideos]);

  useEffect(() => {
    if (!lastVideoRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && hasMore && !loadingRef.current) {
          loadMoreVideos();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    observer.observe(lastVideoRef.current);

    return () => {
      observer.disconnect();
    };
  }, [videos.length, hasMore, loadMoreVideos]);

  const handleAdjustVolume = (e) => {
    setVolume(e.target.value / 100);
  };

  return (
    <div className={clsx(styles.wrapper)}>
      <>
        {isLoading ? (
          <div className={clsx(styles.skeletonWrapper)}>
            <div className={clsx(styles.loading, "skeletonItem")}></div>
            <div className={clsx(styles.loading, "skeletonItem")}></div>
            <div className={clsx(styles.loading, "skeletonItem")}></div>
          </div>
        ) : (
          videos.map((video, index) => (
            <div
              key={video.id}
              ref={index === videos.length - 1 ? lastVideoRef : null}
            >
              <Video
                currentUser={currentUser}
                data={video}
                volume={volume}
                adjustVolume={handleAdjustVolume}
                mute={mute}
                toggleMuted={handleToggleMute}
              />
            </div>
          ))
        )}
        {isLoadingMore && (
          <div className={clsx(styles.skeletonWrapper)}>
            <div className={clsx(styles.loading, "skeletonItem")}></div>
          </div>
        )}
      </>
    </div>
  );
}
