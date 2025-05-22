import clsx from "clsx";
import styles from "./AccountPreview.module.scss";
import Image from "~/components/Image";
import Button from "~/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Wrapper as PopperWrapper } from "~/components/Popper";
import Tippy from "@tippyjs/react/headless";
import { formatters } from "~/helpers";

function AccountPreview({ offset = [-20, 0], data, children }) {
  if (!data) {
    return children;
  }

  const renderPreview = (props) => (
    <div tabIndex="-1" {...props}>
      <PopperWrapper>
        <div className={clsx(styles.wrapper)}>
          <div className={clsx(styles.header)}>
            <Image
              src={data?.avatar}
              alt="ok"
              className={clsx(styles.avatar)}
            />
            <Button primary className={clsx(styles.followBtn)}>
              Theo dõi
            </Button>
          </div>
          <div className={clsx(styles.body)}>
            <p className={clsx(styles.nickname)}>
              <strong>{data?.nickname}</strong>
              {data?.tick && (
                <FontAwesomeIcon
                  className={clsx(styles.check)}
                  icon={faCheckCircle}
                />
              )}
            </p>
            <p className={clsx(styles.display)}>{data?.fullName}</p>
            <p className={clsx(styles.analytics)}>
              <strong className={clsx(styles.value)}>
                {formatters.formatNumber(data?.followersCount ?? 0)}
              </strong>
              <span className={clsx(styles.label)}>Theo dõi</span>
              <strong className={clsx(styles.value)}>
                {formatters.formatNumber(data?.likesCount ?? 0)}
              </strong>
              <span className={clsx(styles.label)}>Lượt thích</span>
            </p>
            <div className={clsx(styles.bio)}>
              <p>{data?.bio ? data?.bio : "Không có."}</p>
            </div>
          </div>
        </div>
      </PopperWrapper>
    </div>
  );

  return (
    <Tippy
      offset={offset}
      appendTo={document.body}
      interactive
      delay={[800, 0]}
      placement="bottom"
      render={renderPreview}
    >
      {children}
    </Tippy>
  );
}

export default AccountPreview;
