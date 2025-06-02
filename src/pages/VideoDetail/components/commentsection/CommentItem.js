import clsx from "clsx";
import styles from "./Comment.module.scss";
import Image from "~/components/Image";
import { Link } from "react-router-dom";
import { FlagIcon, HeartIcon, MoreIcon, TrashIcon } from "~/components/Icons";
import Tippy from "@tippyjs/react/headless";
import { Wrapper as PopperWrapper } from "~/components/Popper";
import { useMemo, useState } from "react";
import { formatters } from "~/helpers";
import { useDebounceCallback } from "~/hooks/useDebouncedCallback";
import { likecomment } from "~/services/videos/videoService";

export default function CommentItem({ data, onReply, currentUser }) {
  const [likeCount, setLikeCount] = useState(data?.likesCount ?? 0);
  const [isLiked, setIsLiked] = useState(data?.isLiked ?? false);
  const formattedDate = useMemo(() => {
    return data?.createdAt ? formatters.formatDate(data.createdAt) : "";
  }, [data?.createdAt]);
  const debouncedLikeVideo = useDebounceCallback(async () => {
    const result = await likecomment(data?.id);
    setLikeCount(result.data);
  }, 500);

  const handleLikeComment = () => {
    if (!currentUser) return;

    setIsLiked((prev) => !prev);
    debouncedLikeVideo();
  };
  return (
    <div className={clsx(styles.itemWrapper)}>
      <div className={clsx(styles.avatarWrapper)}>
        <Image src={data?.user.avatar} alt={data?.user.fullName} />
      </div>
      <div className={clsx(styles.contentWrapper)}>
        <div className={clsx(styles.contentHeader)}>
          <div className={clsx(styles.userName)}>
            <Link to={`/@${data?.user.nickname}`}>{data?.user.fullName}</Link>
          </div>
          <Tippy
            offset={[20, 10]}
            interactive
            delay={[50, 0]}
            placement="bottom"
            render={(props) => (
              <div tabIndex="-1" {...props}>
                <PopperWrapper className={clsx(styles.menuContainer)}>
                  <div className={clsx(styles.menuItems)}>
                    <button className={clsx(styles.menuItem)}>
                      <FlagIcon width="1.9rem" height="1.9rem" />
                      <span>Báo cáo</span>
                    </button>
                    <button className={clsx(styles.menuItem)}>
                      <TrashIcon width="1.9rem" height="1.9rem" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </PopperWrapper>
              </div>
            )}
          >
            <div className={clsx(styles.divMore)}>
              <MoreIcon width="2.4rem" height="2.4rem" />
            </div>
          </Tippy>
        </div>
        <span className={clsx(styles.level1)}>
          <p>{data?.content}</p>
        </span>
        <div className={clsx(styles.subContent)}>
          <span className={clsx(styles.time)}>{formattedDate}</span>
          <div className={clsx(styles.like)}>
            <div
              className={clsx(styles.icon, {
                [styles.liked]: isLiked,
              })}
              onClick={handleLikeComment}
            >
              <HeartIcon width="2.4rem" height="2.4rem" />
            </div>
            <span>{likeCount}</span>
          </div>
          {onReply && (
            <span className={clsx(styles.text)} onClick={onReply}>
              Trả lời
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
