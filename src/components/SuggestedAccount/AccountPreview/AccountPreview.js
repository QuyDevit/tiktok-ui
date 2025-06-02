import clsx from "clsx";
import styles from "./AccountPreview.module.scss";
import Image from "~/components/Image";
import Button from "~/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Wrapper as PopperWrapper } from "~/components/Popper";
import Tippy from "@tippyjs/react/headless";
import { formatters } from "~/helpers";
import { useState } from "react";
import { selectUser } from "~/store/features/authSlice";
import { useSelector } from "react-redux";
import { useDebounceCallback } from "~/hooks/useDebouncedCallback";
import { followUser } from "~/services/users/followUser";

function AccountPreview({ offset = [-20, 0], data, children }) {
  const [followingCount, setFollowingCount] = useState(
    data?.followingsCount ?? 0
  );

  const [isFollow, setIsFollow] = useState(data?.isFollowed ?? false);
  const currentUser = useSelector(selectUser);
  const handleFollowUser = () => {
    if (!currentUser) return;

    setIsFollow((prev) => !prev);
    debouncedFollowUser();
  };
  const debouncedFollowUser = useDebounceCallback(async () => {
    await followUser(data?.id);
    setFollowingCount((prev) => (isFollow ? prev - 1 : prev + 1));
  }, 500);
  if (!data) {
    return children;
  }

  const renderPreview = (props) => (
    <div tabIndex="-1" {...props}>
      <PopperWrapper>
        <div className={clsx(styles.wrapper)}>
          <div className={clsx(styles.header)}>
            <Image
              src={data?.avatar}
              alt="ok"
              className={clsx(styles.avatar)}
            />
            <Button
              className={clsx(styles.followBtn)}
              primary={!isFollow}
              outline={isFollow}
              onClick={handleFollowUser}
            >
              {isFollow ? "Đang theo dõi" : "Theo dõi"}
            </Button>
          </div>
          <div className={clsx(styles.body)}>
            <p className={clsx(styles.nickname)}>
              <strong>{data?.nickname}</strong>
              {data?.tick && (
                <FontAwesomeIcon
                  className={clsx(styles.check)}
                  icon={faCheckCircle}
                />
              )}
            </p>
            <p className={clsx(styles.display)}>{data?.fullName}</p>
            <p className={clsx(styles.analytics)}>
              <strong className={clsx(styles.value)}>
                {formatters.formatNumber(followingCount)}
              </strong>
              <span className={clsx(styles.label)}>Theo dõi</span>
              <strong className={clsx(styles.value)}>
                {formatters.formatNumber(data?.likesCount ?? 0)}
              </strong>
              <span className={clsx(styles.label)}>Lượt thích</span>
            </p>
            <div className={clsx(styles.bio)}>
              <p>{data?.bio ? data?.bio : "Không có."}</p>
            </div>
          </div>
        </div>
      </PopperWrapper>
    </div>
  );

  return (
    <Tippy
      offset={offset}
      appendTo={document.body}
      interactive
      delay={[800, 0]}
      placement="bottom"
      render={renderPreview}
    >
      {children}
    </Tippy>
  );
}

export default AccountPreview;
