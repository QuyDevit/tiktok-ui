import clsx from "clsx";
import styles from "./AccountPreview.module.scss";
import Image from "~/components/Image";
import Button from "~/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Wrapper as PopperWrapper } from "~/components/Popper";
import Tippy from "@tippyjs/react/headless";
import * as hepler from "~/helpers";

function AccountPreview({ offset = [-20, 0], data, children }) {
  const {first_name, last_name, likes_count, nickname,followers_count,bio,avatar } = data|| {};

  return (
    <Tippy
      offset={offset}
      appendTo={document.body}
      interactive
      delay={[800, 0]}
      placement="bottom"
      render={(props) => (
        <div tabIndex="-1" {...props}>
          <PopperWrapper>
            <div className={clsx(styles.wrapper)}>
              <div className={clsx(styles.header)}>
                <Image src={avatar} alt="ok" className={clsx(styles.avatar)} />
                <Button primary className={clsx(styles.followBtn)}>
                  Theo dõi
                </Button>
              </div>
              <div className={clsx(styles.body)}>
                <p className={clsx(styles.nickname)}>
                  <strong>{nickname}</strong>
                  <FontAwesomeIcon
                    className={clsx(styles.check)}
                    icon={faCheckCircle}
                  />
                </p>
                <p className={clsx(styles.display)}>
                  {first_name} {last_name}
                </p>
                <p className={clsx(styles.analytics)}>
                  <strong className={clsx(styles.value)}>
                    {hepler.formatters.formatNumber(followers_count)}
                  </strong>
                  <span className={clsx(styles.label)}>Theo dõi</span>
                  <strong className={clsx(styles.value)}>
                  {hepler.formatters.formatNumber(likes_count)}
                  </strong>
                  <span className={clsx(styles.label)}>Lượt thích</span>
                </p>
                <div className={clsx(styles.bio)}>
                  <p>{bio ? bio : "Không có."}</p>
                </div>
              </div>
            </div>
          </PopperWrapper>
        </div>
      )}
    >
      {children}
    </Tippy>
  );
}

export default AccountPreview;
