import clsx from "clsx";
import styles from "./ChatItem.module.scss";
import Image from "../Image";
import images from "~/assets/images";
function ChatItem({ data, user, onClick, isActive }) {
  return (
    <div
      className={clsx(styles.container, isActive ? styles.active : "")}
      onClick={onClick}
    >
      <Image
        src={user ? user?.avatar : images.noImage}
        alt={data?.isGroupChat ? data?.name : user?.fullName}
        className={clsx(styles.avatar)}
      />
      <div className={clsx(styles.infoWrapper)}>
        <p className={clsx(styles.userName)}>
          {data?.isGroupChat ? data?.name : user?.fullName}
        </p>
        <p className={clsx(styles.content)}>
          {data?.latestMessage
            ? data?.latestMessage.content
            : `Gửi lời chào đến ${
                data?.isGroupChat ? data?.name : user?.fullName
              }`}
        </p>
      </div>
    </div>
  );
}

export default ChatItem;
