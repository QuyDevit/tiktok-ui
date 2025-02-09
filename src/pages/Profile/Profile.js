import React, { useState } from "react";
import clsx from "clsx";
import styles from "./Profile.module.scss";
import Image from "~/components/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Button from "~/components/Button";
import {
  LinkIcon,
  MoreIcon,
  MyVideoIcon,
  PlaceholderIcon,
  ShareIconProfile,
  VideoFavoritIcon,
  VideoLikedIcon,
} from "~/components/Icons";
import { Link } from "react-router-dom";
import ProfileVideo from "./ProfileVideo";

const options = ["Mới nhất", "Thịnh hành", "Cũ nhất"];
const tabs = [
  {
    label: "Video",
    icon: <MyVideoIcon width="2rem" height="2rem" />,
    width: 137,
    left: 0,
  },
  {
    label: "Yêu thích",
    icon: <VideoFavoritIcon width="2rem" height="2rem" />,
    width: 167,
    left: 137,
  },
  {
    label: "Đã thích",
    icon: <VideoLikedIcon width="2rem" height="2rem" />,
    width: 158,
    left: 304,
  },
];
export default function Profile() {
  const [activeSort, setActiveSort] = useState(0);
  const [activetTab, setActiveTab] = useState(0);
  const [hoverTab, setHoverTab] = useState(null);

  const currentIndex = hoverTab !== null ? hoverTab : activetTab;
  return (
    <div className={clsx(styles.container)}>
      <div className={clsx(styles.layoutHeader)}>
        <div className={clsx(styles.avatarWrapper)}>
          <Image
            className={clsx(styles.imgAvatar)}
            src="https://p16-sign-sg.tiktokcdn.com/aweme/1080x1080/tos-alisg-avt-0068/ad715e344a62c6ac764ad85e79610f8f.jpeg?lk3s=a5d48078&nonce=59297&refresh_token=8dca8cbdbb0145dcf32b1f13125d406c&x-expires=1738810800&x-signature=A6cBc9EVE7T1sj4V2rnPAGAFiEI%3D&shp=a5d48078&shcp=81f88b70" alt=""
          />
        </div>
        <div className={clsx(styles.creatorPage)}>
          <div className={clsx(styles.divUserNameWrapper)}>
            <div className={clsx(styles.userText)}>
              <h1 className={clsx(styles.userid)}>boss.phuonganh</h1>
              <FontAwesomeIcon
                className={clsx(styles.check)}
                icon={faCheckCircle}
              />
            </div>
            <div className={clsx(styles.userSubTitle)}>
              <h2 className={clsx(styles.name)}>Phương Anh</h2>
            </div>
          </div>
          <div className={clsx(styles.divUserPanelWrapper)}>
            <Button primary>Theo dõi</Button>
            <Button className={clsx(styles.btn)}>Tin nhắn</Button>
            <Button className={clsx(styles.btnIcon)}>
              <ShareIconProfile width="1.9rem" height="1.9rem" />
            </Button>
            <Button className={clsx(styles.btnIcon)}>
              <MoreIcon width="1.9rem" height="1.9rem" />
            </Button>
          </div>
          <div className={clsx(styles.divUserInfoWrapper)}>
            <h3 className={clsx(styles.countInfos)}>
              <div className={styles.divValue}>
                <strong className={clsx(styles.textValue)}>9</strong>
                <span className={clsx(styles.title)}>Đang Follow</span>
              </div>
              <div className={styles.divValue}>
                <strong className={clsx(styles.textValue)}>875.5K</strong>
                <span className={clsx(styles.title)}>Follower</span>
              </div>
              <div className={styles.divValue}>
                <strong className={clsx(styles.textValue)}>15.9M</strong>
                <span className={clsx(styles.title)}>Thích</span>
              </div>
            </h3>
            <h2 className={clsx(styles.description)}>
              LIÊN HỆ PHƯƠNG ANH TẠI ĐÂY 👇🏻
            </h2>
            <div className={clsx(styles.bioWrapper)}>
              <Link to={"/following"} className={clsx(styles.bioLink)}>
                <LinkIcon width="1.8rem" height="1.8rem" />
                <span className={clsx(styles.link)}>
                  https://www.tiktok.com/
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className={clsx(styles.layoutMain)}>
        <div className={clsx(styles.tabWrapper)}>
          <div className={clsx(styles.videoFeedTab)}>
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
          </div>
          <div className={clsx(styles.segmentedControl)}>
            {options.map((label, index) => (
              <button
                key={label}
                onClick={() => setActiveSort(index)}
                type="button"
                className={clsx(styles.btnSort, {
                  [styles.active]: activeSort === index,
                })}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <main className={clsx(styles.mainDetailWrapper)}>
          <ProfileVideo tab={activetTab}/>
        </main>
      </div>
    </div>
  );
}
