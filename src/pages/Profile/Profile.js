import React, { useEffect, useState } from "react";
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
  SettingIcon,
  ShareIconProfile,
  UserIcon,
  VideoFavoritIcon,
  VideoLikedIcon,
} from "~/components/Icons";
import { Link, useParams } from "react-router-dom";
import ProfileVideo from "./ProfileVideo";
import { getInfoAccount } from "~/services/users/getInfoUser";
import { formatters } from "~/helpers";
import { useSelector } from "react-redux";
import { selectUser } from "~/store/features/authSlice";
import EditProfileModal from "./EditProfileModal";
import routes, { pagesTitle } from "~/config/routes";
import { useDebounceCallback } from "~/hooks/useDebouncedCallback";
import { followUser } from "~/services/users/followUser";

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
  const { nickname } = useParams();
  const currentUser = useSelector(selectUser);

  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSort, setActiveSort] = useState(0);
  const [activetTab, setActiveTab] = useState(0);
  const [hoverTab, setHoverTab] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [followingCount, setFollowingCount] = useState(
    account?.followingsCount ?? 0
  );
  const [isFollow, setIsFollow] = useState(account?.isFollowed ?? false);

  useEffect(() => {
    if (account) {
      setIsFollow(account.isFollowed);
      setFollowingCount(account.followingsCount);
    }
  }, [account]);

  const debouncedFollowUser = useDebounceCallback(async () => {
    await followUser(account?.id);
    setFollowingCount((prev) => (isFollow ? prev - 1 : prev + 1));
  }, 500);

  const currentIndex = hoverTab !== null ? hoverTab : activetTab;

  useEffect(() => {
    setLoading(true);
    const fetchApi = async () => {
      const result = await getInfoAccount(nickname.replace(/^@/, ""));
      setAccount(result.data);
      setLoading(false);
    };
    fetchApi();
  }, [nickname, currentUser]);

  useEffect(() => {
    if (!account) return;
    const title = pagesTitle[routes.profile];
    document.title = title(`${account.fullName}`, account.nickname);
  }, [account]);

  if (loading) return <h2>Đang tải</h2>;

  const isCurrentUser = currentUser
    ? currentUser && currentUser.nickname === account?.nickname
    : false;

  const handleFollowUser = () => {
    if (!currentUser) return;

    setIsFollow((prev) => !prev);
    debouncedFollowUser();
  };

  if (!account)
    return (
      <div className={clsx(styles.userEmpty)}>
        <UserIcon width="6rem" height="6rem" />
        <h2>Không thể tìm thấy tài khoản này.</h2>
      </div>
    );

  return (
    <div className={clsx(styles.container)}>
      {isCurrentUser && (
        <EditProfileModal
          isOpen={openModal}
          onClose={setOpenModal}
          currentUser={currentUser}
        />
      )}

      <div className={clsx(styles.layoutHeader)}>
        <div className={clsx(styles.avatarWrapper)}>
          <Image
            className={clsx(styles.imgAvatar)}
            src={account?.avatar}
            alt=""
          />
        </div>
        <div className={clsx(styles.creatorPage)}>
          <div className={clsx(styles.divUserNameWrapper)}>
            <div className={clsx(styles.userText)}>
              <h1 className={clsx(styles.userid)}>{account?.nickname}</h1>
              {account?.tick && (
                <FontAwesomeIcon
                  className={clsx(styles.check)}
                  icon={faCheckCircle}
                />
              )}
            </div>
            <div className={clsx(styles.userSubTitle)}>
              <h2 className={clsx(styles.name)}>{account?.fullName}</h2>
            </div>
          </div>
          <div className={clsx(styles.divUserPanelWrapper)}>
            {isCurrentUser ? (
              <>
                <Button primary onClick={() => setOpenModal(true)}>
                  Sửa hồ sơ
                </Button>
                <Button className={clsx(styles.btn)}>Quảng bá bài đăng</Button>
                <Button className={clsx(styles.btnIcon)}>
                  <SettingIcon width="1.9rem" height="1.9rem" />
                </Button>
                <Button className={clsx(styles.btnIcon)}>
                  <ShareIconProfile width="1.9rem" height="1.9rem" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  primary={!isFollow}
                  outline={isFollow}
                  onClick={handleFollowUser}
                >
                  {isFollow ? "Đang theo dõi" : "Theo dõi"}
                </Button>
                <Button className={clsx(styles.btn)}>Tin nhắn</Button>
                <Button className={clsx(styles.btnIcon)}>
                  <ShareIconProfile width="1.9rem" height="1.9rem" />
                </Button>
                <Button className={clsx(styles.btnIcon)}>
                  <MoreIcon width="1.9rem" height="1.9rem" />
                </Button>
              </>
            )}
          </div>
          <div className={clsx(styles.divUserInfoWrapper)}>
            <h3 className={clsx(styles.countInfos)}>
              <div className={styles.divValue}>
                <strong className={clsx(styles.textValue)}>
                  {formatters.formatNumber(account.followersCount)}
                </strong>
                <span className={clsx(styles.title)}>Đang Follow</span>
              </div>
              <div className={styles.divValue}>
                <strong className={clsx(styles.textValue)}>
                  {formatters.formatNumber(followingCount)}
                </strong>
                <span className={clsx(styles.title)}>Follower</span>
              </div>
              <div className={styles.divValue}>
                <strong className={clsx(styles.textValue)}>
                  {formatters.formatNumber(account.likesCount)}
                </strong>
                <span className={clsx(styles.title)}>Thích</span>
              </div>
            </h3>
            <h2 className={clsx(styles.description)}>{account?.bio}</h2>
            <div className={clsx(styles.bioWrapper)}>
              <Link to={"/following"} className={clsx(styles.bioLink)}>
                <LinkIcon width="1.8rem" height="1.8rem" />
                <span className={clsx(styles.link)}>
                  https://www.tiktokclone.hoi/
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
          <ProfileVideo tab={activetTab} />
        </main>
      </div>
    </div>
  );
}
