import clsx from "clsx";
import styles from "../Search.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  selectkeywordSearch,
  selecttabSearchIndex,
  setTabSearchIndex,
} from "~/store/features/homeSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "~/config/routes";

const tabs = [
  {
    label: "Top",
    width: 30,
    left: 0,
  },
  {
    label: "Người dùng",
    width: 90,
    left: 107,
  },
  {
    label: "Video",
    width: 46,
    left: 275,
  },
  {
    label: "LIVE",
    width: 37,
    left: 397,
  },
];

function TabSearch() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = useSelector(selectkeywordSearch);
  const activeTab = useSelector(selecttabSearchIndex);
  const [hoverTab, setHoverTab] = useState(null);
  const currentIndex = hoverTab !== null ? hoverTab : activeTab;

  const handlerMapSearch = (index) => {
    dispatch(setTabSearchIndex(index));
    const queryString = query ? `?q=${query}` : "";

    switch (index) {
      case 0:
        navigate(`${config.search}${queryString}`);
        break;
      case 1:
        navigate(`${config.searchaccount}${queryString}`);
        break;
      case 2:
        navigate(`${config.searchvideo}${queryString}`);
        break;
      default:
        break;
    }
  };

  return (
    <header className={clsx(styles.header)}>
      {tabs.map((tab, index) => (
        <div
          key={index}
          onClick={() => handlerMapSearch(index)}
          onMouseEnter={() => setHoverTab(index)}
          onMouseLeave={() => setHoverTab(null)}
          className={clsx(styles.tabItem, {
            [styles.active]: activeTab === index,
          })}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </div>
      ))}
      <div
        className={clsx(styles.divBottomLine)}
        style={{
          width: `${tabs[currentIndex].width}px`,
          transform: `translateX(${tabs[currentIndex].left}px)`,
        }}
      ></div>
    </header>
  );
}

export default TabSearch;
