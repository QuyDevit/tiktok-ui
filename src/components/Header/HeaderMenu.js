import clsx from "clsx";
import styles from "./Header.module.scss";
import Menu from "~/components/Popper/Menu";
import Image from "~/components/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

export default function HeaderMenu({ currentUser, menuItems, handleMenuChange }) {
  return (
    <Menu items={menuItems} onChange={handleMenuChange}>
      {currentUser ? (
        <Image
          className={clsx(styles.userAvatar)}
          src={currentUser?.avatar}
          alt="User Avatar"
        />
      ) : (
        <button className={clsx(styles.moreBtn)}>
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </button>
      )}
    </Menu>
  );
}
