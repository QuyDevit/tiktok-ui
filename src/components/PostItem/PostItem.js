import clsx from "clsx";
import styles from "./PostItem.module.scss";
import { Link } from "react-router-dom";
import Image from "../Image";
import { useRef } from "react";

function PostItem({ data,onHover }) {
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
          src={
            "https://files.fullstack.edu.vn/f8-tiktok/videos/3712-666b02d872740.mp4"
          }
          ref={videoRef}
          className={clsx(styles.shortVideo)}
        />
      </div>
      <div className={clsx(styles.description)}>
        <div className={clsx(styles.divCaption)}>
          Quả lê có những loại nào những loại nào{" "}
        </div>
        <div className={clsx(styles.divSubInfo)}>
          <Link to={""} className={clsx(styles.linkAccount)}>
            <Image
              src="https://files.fullstack.edu.vn/f8-tiktok/users/5203/644a3d01ca0cb.jpg"
              alt=""
              className={clsx(styles.imgAvatar)}
            />
            <span className={clsx(styles.nickname)}>khanhlyy98</span>
          </Link>
          <div className={clsx(styles.divTime)}>2024-9-21</div>
        </div>
      </div>
    </div>
  );
}

export default PostItem;
