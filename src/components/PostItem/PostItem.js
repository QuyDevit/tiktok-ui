import clsx from "clsx";
import styles from "./PostItem.module.scss";
import { Link } from "react-router-dom";
import Image from "../Image";
import { useRef } from "react";
import { formatters } from "~/helpers";

function PostItem({ data, onHover }) {
  const videoRef = useRef(null);
  const handleMouseEnter = () => {
    if (onHover) {
      onHover(videoRef.current);
    }
  };
  return (
    <div className={clsx(styles.container)}>
      <div className={clsx(styles.shortVideo)} onMouseEnter={handleMouseEnter}>
        <video
          loop
          controls={false}
          muted
          src={data?.fileUrl}
          ref={videoRef}
          className={clsx(styles.shortVideo)}
        />
      </div>
      <div className={clsx(styles.description)}>
        <div className={clsx(styles.divCaption)}>{data?.description}</div>
        <div className={clsx(styles.divSubInfo)}>
          <Link to={""} className={clsx(styles.linkAccount)}>
            <Image
              src={data?.user.avatar}
              alt={data?.user.fullName}
              className={clsx(styles.imgAvatar)}
            />
            <span className={clsx(styles.nickname)}>{data?.user.nickname}</span>
          </Link>
          <div className={clsx(styles.divTime)}>
            {formatters.formatShortDate(data?.publishedAt)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostItem;
