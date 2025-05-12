import React, { useState } from "react";
import clsx from "clsx";
import styles from "./Search.module.scss";
import SearchAccountItem from "~/components/SearchAccountItem";
import PostItem from "~/components/PostItem";
import TabSearch from "./TabSearch";
import { useSearch } from "~/hooks/useSearch";

export default function Search() {
  const { searchResult } = useSearch();
  const [activeVideo, setActiveVideo] = useState(null);

  const handleHover = (video) => {
    if (activeVideo && activeVideo !== video) {
      activeVideo.pause();
      activeVideo.currentTime = 0;
    }
    setActiveVideo(video);
    video.play();
  };

  return (
    <div className={clsx(styles.container)}>
      <TabSearch />
      <div className={clsx(styles.divBlockContainer)}>
        <div className={clsx(styles.titleContainer)}>
          <h2>Người dùng</h2>
        </div>
        {searchResult.length > 0 ? (
          searchResult.map((item) => (
            <SearchAccountItem key={item.id} data={item} />
          ))
        ) : (
          <div className={clsx(styles.divEmpty)}>
            Không tìm thấy người dùng.
          </div>
        )}
      </div>
      <div className={clsx(styles.divBlockContainer)}>
        <div className={clsx(styles.titleContainer)}>
          <h2>Video</h2>
        </div>
        <div className={clsx(styles.shortVideoWrapper)}>
          {[...Array(4)].map((_, index) => (
            <PostItem key={index} onHover={handleHover} />
          ))}
        </div>
      </div>
    </div>
  );
}
