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
          src="https://yt3.ggpht.com/ytc/AIdro_mhpdt52gf-ewuMICMSpf58jqqKXetktX-rAgmJkXZktJrVu4vDkBYngfAtIfmb6uJy3w=s88-c-k-c0x00ffffff-no-rj"
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
