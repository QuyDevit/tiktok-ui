import PropTypes from "prop-types";
import clsx from "clsx";
import styles from "./SuggestedAccount.module.scss";
import Image from "../Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import AccountPreview from "./AccountPreview";
import { Link } from "react-router-dom";
function AccountItem({ data }) {
  return (
    <div>
      <AccountPreview data={data}>
        <Link to={`/@${data?.nickname}`} className={clsx(styles.accountItem)}>
          <Image
            src={data.avatar}
            alt={data.nickname}
            className={clsx(styles.userAvatar)}
          />
          <div className={clsx(styles.itemInfo)}>
            <p className={clsx(styles.nickname)}>
              <strong className={clsx(styles.userid)}>{data.nickname}</strong>
              {data.tick && (
                <FontAwesomeIcon
                  className={clsx(styles.check)}
                  icon={faCheckCircle}
                />
              )}
            </p>
            <p className={clsx(styles.display)}>{data?.fullName}</p>
          </div>
        </Link>
      </AccountPreview>
    </div>
  );
}

AccountItem.propTypes = {
  data: PropTypes.object.isRequired,
};
export default AccountItem;
