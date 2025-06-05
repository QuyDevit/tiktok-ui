import clsx from "clsx";
import styles from "./MessageItem.module.scss";
import Image from "../Image";
import images from "~/assets/images";

function MessageItem({ data, user, isRight }) {
  if (!data) return null;

  return (
    <div className={clsx(styles.container)}>
      <div
        className={clsx(
          styles.divContent,
          isRight ? styles.right : styles.left
        )}
      >
        <div className={clsx(styles.avatarWrapper)}>
          <Image
            src={user ? user?.avatar : images.noImage}
            alt={user?.fullName}
          />
        </div>
        <div
          className={clsx(
            styles.contentWrapper,
            isRight ? styles.right : styles.left
          )}
        >
          <p className={clsx(styles.content)}>{data.content}</p>
          <p className={clsx(styles.time)}>
            {new Date(data.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MessageItem;
