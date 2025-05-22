import PostItem from "~/components/PostItem";
import TabSearch from "../TabSearch/TabSearch";
import clsx from "clsx";
import styles from "../Search.module.scss";
import { useSearch } from "~/hooks/useSearch";
import { useState } from "react";

function SearchVideo({ hideTabSearch }) {
  const { searchResult } = useSearch("video");
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
    <div
      className={clsx(styles.container)}
      style={hideTabSearch && { padding: 0 }}
    >
      {!hideTabSearch && <TabSearch />}
      <div className={clsx(styles.divBlockContainer)}>
        <div className={clsx(styles.titleContainer)}>
          <h2>Video</h2>
        </div>
        <div className={clsx(styles.shortVideoWrapper)}>
          {searchResult && searchResult.length > 0 ? (
            searchResult.map((item, index) => (
              <PostItem
                key={item?.id || index}
                data={item}
                onHover={handleHover}
              />
            ))
          ) : (
            <div className={clsx(styles.divEmpty)}>
              {searchResult === null
                ? "Nhập từ khóa để tìm kiếm video"
                : "Không tìm thấy video."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchVideo;
