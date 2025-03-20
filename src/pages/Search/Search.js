import React, { useState } from "react";
import clsx from "clsx";
import styles from "./Search.module.scss";
import { Link, useSearchParams } from "react-router-dom";
import Image from "~/components/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Button from "~/components/Button";
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
export default function Search() {
  const [searchParams] = useSearchParams();
  const [activetTab, setActiveTab] = useState(0);
  const [hoverTab, setHoverTab] = useState(null);

  const query = searchParams.get("q");
  const currentIndex = hoverTab !== null ? hoverTab : activetTab;
  return (
    <div className={clsx(styles.container)}>
      <header className={clsx(styles.header)}>
        {tabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => setActiveTab(index)}
            onMouseEnter={() => setHoverTab(index)}
            onMouseLeave={() => setHoverTab(null)}
            className={clsx(styles.tabItem, {
              [styles.active]: activetTab === index,
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
      <div className={clsx(styles.divBlockContainer)}>
        <div className={clsx(styles.titleContainer)}>
          <h2>Người dùng</h2>
        </div>
        <div className={clsx(styles.divItemContainer)}>
          <Link to={""} className={clsx(styles.divAvatar)}>
            <Image
              src="https://files.fullstack.edu.vn/f8-tiktok/users/5203/644a3d01ca0cb.jpg"
              className={clsx(styles.image)}
            />
          </Link>
          <Link to={""} className={clsx(styles.infoWrapper)}>
            <p className={clsx(styles.nickname)}>
              <span>letuankhang2002</span>
              <FontAwesomeIcon
                className={clsx(styles.check)}
                icon={faCheckCircle}
              />
            </p>
            <div className={clsx(styles.subInfo)}>
                <span>Lê Tuấn Khang  ·</span>
                <strong>13.7M</strong>
                <span>Người theo dõi</span>
            </div>
            <p className={clsx(styles.description)}>Cuộc sống ở quê em, yên bình và giản dị!</p>
          </Link>
          <div className={clsx(styles.divFollowBtn)}>
            <Button primary>Theo dõi</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
