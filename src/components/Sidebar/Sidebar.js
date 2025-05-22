import React, { useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./Sidebar.module.scss";
import MenuItem from "./Menu/MenuItem";
import Menu from "./Menu";
import config from "~/config";
import {
  ExploreActiveIcon,
  ExploreIcon,
  FollowingActiveIcon,
  FollowingIcon,
  FriendActiveIcon,
  FriendIcon,
  HomeActiveIcon,
  HomeIcon,
  LiveActiveIcon,
  LiveIcon,
  MessageActiveIcon,
  MessageIcon,
  UserIcon,
} from "~/components/Icons";
import Image from "~/components/Image";
import SuggestedAccount from "~/components/SuggestedAccount";
import Button from "~/components/Button";
import Discover from "~/components/Discover/Discover";
import Footer from "./Footer";
import { suggest } from "~/services/suggestAccountService";
import { refreshHome } from "~/store/features/homeSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "~/store/features/authSlice";
import { setOpenForm } from "~/store/features/formAuthSlice";

export default function Sidebar() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(true);
  const [seeAll, setSeeAll] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [displayedAccounts, setDisplayedAccounts] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      setIsLoading(true);
      const result = await suggest(1, 12);
      setAccounts(result);
      setDisplayedAccounts(result.slice(0, 6));
      setIsLoading(false);
    };

    fetchApi();
  }, []);

  const handleSeeAll = () => {
    if (seeAll) {
      setDisplayedAccounts(accounts.slice(0, 6));
    } else {
      setDisplayedAccounts(accounts);
    }
    setSeeAll(!seeAll);
  };
  return (
    <aside className={clsx(styles.wrapper)}>
      <Menu>
        <MenuItem
          onClick={() => dispatch(refreshHome())}
          title={"Dành cho bạn"}
          to={config.routes.home}
          icon={<HomeIcon />}
          activeIcon={<HomeActiveIcon />}
        />
        <MenuItem
          title={"Khám phá"}
          to={config.routes.explore}
          icon={<ExploreIcon />}
          activeIcon={<ExploreActiveIcon />}
        />
        <MenuItem
          title={"Đang theo dõi"}
          to={config.routes.following}
          icon={<FollowingIcon className={clsx(styles.customIcon)} />}
          activeIcon={
            <FollowingActiveIcon className={clsx(styles.customIcon)} />
          }
        />
        {currentUser && (
          <MenuItem
            title={"Bạn bè"}
            to={config.routes.friend}
            icon={<FriendIcon />}
            activeIcon={<FriendActiveIcon />}
          />
        )}

        <MenuItem
          title={"LIVE"}
          to={config.routes.live}
          icon={<LiveIcon />}
          activeIcon={<LiveActiveIcon />}
        />
        {currentUser && (
          <MenuItem
            title={"Tin nhắn"}
            to={config.routes.message}
            icon={<MessageIcon />}
            activeIcon={<MessageActiveIcon />}
          />
        )}

        <MenuItem
          title={"Hồ sơ"}
          to={`/@${currentUser ? currentUser?.nickname : ""}`}
          onClick={(e) => {
            if (!currentUser) {
              e.preventDefault();
              dispatch(setOpenForm(true));
            }
          }}
          icon={
            currentUser ? (
              <Image
                src={currentUser?.avatar}
                className={clsx(styles.userAvatar)}
              />
            ) : (
              <UserIcon className={clsx(styles.customIcon)} />
            )
          }
        />
      </Menu>
      {!currentUser && (
        <div className={clsx(styles.login)}>
          <div className={clsx(styles.wrapperLogin)}>
            <p className={clsx(styles.note)}>
              Đăng nhập để theo dõi người sáng tạo, thích video và xem bình
              luận.
            </p>
            <Button outline className={clsx(styles.loginBtn)}>
              Đăng nhập
            </Button>
          </div>
        </div>
      )}
      {isLoading ? (
        <div className={clsx(styles.loadingWrapper)}>
          <div className={clsx(styles.loading, "skeletonItem")}></div>
          <div className={clsx(styles.loading, "skeletonItem")}></div>
          <div className={clsx(styles.loading, "skeletonItem")}></div>
          <div className={clsx(styles.loading, "skeletonItem")}></div>
          <div className={clsx(styles.loading, "skeletonItem")}></div>
        </div>
      ) : (
        <SuggestedAccount
          data={displayedAccounts}
          label="Đề xuất người dùng"
          isSeeAll={seeAll}
          loadMore={handleSeeAll}
        />
      )}

      <Discover />
      <Footer />
    </aside>
  );
}
