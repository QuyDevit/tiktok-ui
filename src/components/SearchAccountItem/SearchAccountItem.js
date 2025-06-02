import { Link } from "react-router-dom";
import Image from "../Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import styles from "./SearchAccountItem.module.scss";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button";
import { formatters } from "~/helpers";
import { useSelector } from "react-redux";
import { selectUser } from "~/store/features/authSlice";
import { useDebounceCallback } from "~/hooks/useDebouncedCallback";
import { followUser } from "~/services/users/followUser";
import { useState } from "react";
function SearchAccountItem({ data }) {
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

  return (
    <div className={clsx(styles.divItemContainer)}>
      <Link to={`/@${data?.nickname}`} className={clsx(styles.divAvatar)}>
        <Image src={data?.avatar} className={clsx(styles.image)} />
      </Link>
      <Link to={`/@${data?.nickname}`} className={clsx(styles.infoWrapper)}>
        <p className={clsx(styles.nickname)}>
          <span>{data?.nickname}</span>
          {data?.tick && (
            <FontAwesomeIcon
              className={clsx(styles.check)}
              icon={faCheckCircle}
            />
          )}
        </p>
        <div className={clsx(styles.subInfo)}>
          <span>{data?.fullName} ·</span>
          <strong>{formatters.formatNumber(followingCount)}</strong>
          <span>Người theo dõi</span>
        </div>
        <p className={clsx(styles.description)}>{data?.bio}</p>
      </Link>
      {currentUser && currentUser.id !== data.id && (
        <div className={clsx(styles.divFollowBtn)}>
          <Button
            primary={!isFollow}
            outline={isFollow}
            onClick={handleFollowUser}
          >
            {isFollow ? "Đang theo dõi" : "Theo dõi"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default SearchAccountItem;
