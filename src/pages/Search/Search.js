import React, { useEffect } from "react";
import clsx from "clsx";
import styles from "./Search.module.scss";
import TabSearch from "./TabSearch";
import { useLocation } from "react-router-dom";
import SearchAccount from "./SearchAccount";
import SearchVideo from "./SearchVideo";
import { useDispatch } from "react-redux";
import { setTabSearchIndex } from "~/store/features/homeSlice";

export default function Search() {
  const location = useLocation();
  const dispatch = useDispatch();
  const path = location.pathname;

  useEffect(() => {
    // Set active tab based on path
    if (path.includes("/search/user")) {
      dispatch(setTabSearchIndex(1));
    } else if (path.includes("/search/video")) {
      dispatch(setTabSearchIndex(2));
    } else {
      dispatch(setTabSearchIndex(0));
    }
  }, [path, dispatch]);

  if (path.includes("/search/user")) {
    return <SearchAccount />;
  }

  if (path.includes("/search/video")) {
    return <SearchVideo />;
  }

  return (
    <div className={clsx(styles.container)}>
      <TabSearch />
      <div className={clsx(styles.divBlockContainer)}>
        <div className={clsx(styles.content)}>
          <SearchAccount hideTabSearch />
        </div>
      </div>
      <div className={clsx(styles.divBlockContainer)}>
        <div className={clsx(styles.content)}>
          <SearchVideo hideTabSearch />
        </div>
      </div>
    </div>
  );
}
