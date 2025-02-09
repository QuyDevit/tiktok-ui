import clsx from "clsx";
import styles from "./SuggestedAccount.module.scss";
import PropTypes from "prop-types";
import AccountItem from "./AccountItem";

const defaultFn = () => {};

function SuggestedAccount({ label, data = [], isSeeAll, loadMore = defaultFn }) {
  
  return (
    <div className={clsx(styles.wrapper)}>
      <p className={styles.label}>{label}</p>
      {data.map((account) => (
        <AccountItem key={account.id} data={account} />
      ))}
      <p className={clsx(styles.moreBtn)} onClick={loadMore}>
        {!isSeeAll ? "Tải thêm" : "Ẩn bớt"}
      </p>
    </div>
  );
}

SuggestedAccount.propTypes = {
  label: PropTypes.string.isRequired,
  isSeeAll: PropTypes.bool.isRequired,
};
export default SuggestedAccount;
