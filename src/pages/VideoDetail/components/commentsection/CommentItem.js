import clsx from "clsx";
import styles from "./Comment.module.scss";
import Image from "~/components/Image";
import { Link } from "react-router-dom";
import { FlagIcon, HeartIcon, MoreIcon, TrashIcon } from "~/components/Icons";
import Tippy from "@tippyjs/react/headless";
import { Wrapper as PopperWrapper } from "~/components/Popper";

export default function CommentItem() {
  return (
    <div className={clsx(styles.itemWrapper)}>
      <div className={clsx(styles.avatarWrapper)}>
        <Image src="" alt="" />
      </div>
      <div className={clsx(styles.contentWrapper)}>
        <div className={clsx(styles.contentHeader)}>
          <div className={clsx(styles.userName)}>
            <Link to={""}>Lương Cường</Link>
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
          <p>Tôi có thể giúp bạn đấy!</p>
        </span>
        <div className={clsx(styles.subContent)}>
          <span className={clsx(styles.time)}>5-8</span>
          <div className={clsx(styles.like)}>
            <div className={clsx(styles.icon)}>
              <HeartIcon width="2.4rem" height="2.4rem" />
            </div>
            <span>8</span>
          </div>
          <span className={clsx(styles.text)}>Trả lời</span>
        </div>
      </div>
    </div>
  );
}
