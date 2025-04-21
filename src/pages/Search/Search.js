import React, { useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./Search.module.scss";
import SearchAccountItem from "~/components/SearchAccountItem";
import PostItem from "~/components/PostItem";
import TabSearch from "./TabSearch";
import { useDispatch, useSelector } from "react-redux";
import { selectkeywordSearch, setKeyWordSearch } from "~/store/features/homeSlice";
import { useSearchParams } from "react-router-dom";
import * as searchService from "~/services/searchService";
export default function Search() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [searchResult, setSearchResult] = useState([]);
  const q = useSelector(selectkeywordSearch)
  const query = q || searchParams.get("q");
  const [activeVideo, setActiveVideo] = useState(null);
  useEffect(() => {
    if(!q){
      dispatch(setKeyWordSearch(query))
    }
    const fetchApi = async () => {
      const result = await searchService.search(query);
      setSearchResult(result);
    };
    fetchApi();
  }, []);
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
          <div className={clsx(styles.divEmpty)}>Không tìm thấy người dùng.</div>
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
