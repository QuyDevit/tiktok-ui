import { Link } from "react-router-dom";
import Image from "../Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import styles from "./SearchAccountItem.module.scss";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button";
import { formatters } from "~/helpers";
function SearchAccountItem({ data }) {
  return (
    <div className={clsx(styles.divItemContainer)}>
      <Link to={`/@${data?.nickname}`} className={clsx(styles.divAvatar)}>
        <Image src={data?.avatar} className={clsx(styles.image)} />
      </Link>
      <Link to={`/@${data?.nickname}`} className={clsx(styles.infoWrapper)}>
        <p className={clsx(styles.nickname)}>
          <span>{data?.nickname}</span>
          {data?.tick && (
            <FontAwesomeIcon
              className={clsx(styles.check)}
              icon={faCheckCircle}
            />
          )}
        </p>
        <div className={clsx(styles.subInfo)}>
          <span>{data?.fullName} ·</span>
          <strong>{formatters.formatNumber(data?.followersCount)}</strong>
          <span>Người theo dõi</span>
        </div>
        <p className={clsx(styles.description)}>{data?.bio}</p>
      </Link>
      <div className={clsx(styles.divFollowBtn)}>
        <Button primary>Theo dõi</Button>
      </div>
    </div>
  );
}

export default SearchAccountItem;
