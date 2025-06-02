import clsx from "clsx";
import styles from "../videosection/VideoDetailModal.module.scss";
import Image from "~/components/Image";
import {
  CheckIcon,
  CommentIcon,
  LikeIcon,
  PlusIcon,
  SaveIcon,
  ShareIcon,
} from "~/components/Icons";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFollowedUsers,
  setFollowedUser,
} from "~/store/features/followSlice";
import { likevideo } from "~/services/videos/videoService";
import { useDebounceCallback } from "~/hooks/useDebouncedCallback";
import { followUser } from "~/services/users/followUser";

export default function ActionBar({ currentUser, videoDetail }) {
  const dispatch = useDispatch();
  const followedUsers = useSelector(selectFollowedUsers);
  const [isLiked, setIsLiked] = useState(videoDetail?.isLiked ?? false);
  const [likesCount, setLikesCount] = useState(videoDetail?.likesCount ?? 0);
  const isFollow =
    followedUsers[videoDetail?.user?.id] ??
    videoDetail?.user?.isFollowed ??
    false;

  useEffect(() => {
    setIsLiked(videoDetail?.isLiked ?? false);
    setLikesCount(videoDetail?.likesCount ?? 0);
  }, [videoDetail]);

  const debouncedLikeVideo = useDebounceCallback(async () => {
    const result = await likevideo(videoDetail?.id);
    setLikesCount(result.data);
  }, 500);

  const likeVideo = () => {
    if (!currentUser) return;

    setIsLiked((prev) => !prev);
    debouncedLikeVideo();
  };
  const debouncedFollowUser = useDebounceCallback(async () => {
    await followUser(videoDetail?.user.id);
    dispatch(
      setFollowedUser({ userId: videoDetail?.user.id, isFollowed: !isFollow })
    );
  }, 500);

  const handleFollowUser = () => {
    if (!currentUser) return;
    debouncedFollowUser();
  };
  return (
    <div className={clsx(styles.actionBarContainer)}>
      <div className={clsx(styles.divAvatarActionBar)}>
        <Image
          src={videoDetail?.user.avatar}
          alt={videoDetail?.user.fullName}
          className={clsx(styles.imgAvatar)}
        />
        {currentUser && currentUser.id != videoDetail?.user.id && (
          <button
            className={clsx(styles.styleAvatarFollow)}
            style={isFollow ? { background: "white" } : {}}
            onClick={handleFollowUser}
          >
            {isFollow ? (
              <CheckIcon
                width="1.4rem"
                height="1.4rem"
                className={clsx(styles.liked)}
              />
            ) : (
              <PlusIcon width="1.4rem" height="1.4rem" />
            )}
          </button>
        )}
      </div>
      <button className={clsx(styles.btnActionItem)} onClick={likeVideo}>
        <span
          className={clsx(styles.iconStyle, {
            [styles.liked]: isLiked,
          })}
        >
          <LikeIcon />
        </span>
        <strong>{likesCount}</strong>
      </button>
      <button className={clsx(styles.btnActionItem)}>
        <span className={clsx(styles.iconStyle)}>
          <CommentIcon />
        </span>
        <strong>{videoDetail?.commentsCount}</strong>
      </button>
      <button className={clsx(styles.btnActionItem)}>
        <span className={clsx(styles.iconStyle)}>
          <SaveIcon />
        </span>
        <strong>{videoDetail?.viewsCount}</strong>
      </button>
      <button className={clsx(styles.btnActionItem)}>
        <span className={clsx(styles.iconStyle)}>
          <ShareIcon />
        </span>
        <strong>{videoDetail?.sharesCount}</strong>
      </button>
    </div>
  );
}
