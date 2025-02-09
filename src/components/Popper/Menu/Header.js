
import clsx from "clsx";
import styles from "./Menu.module.scss";
import { BackIcon } from "~/components/Icons";
import PropTypes from "prop-types";

function Header({ title, onBack}) {

  return (
   <header className={clsx(styles.header)}>
    <button className={clsx(styles.backBtn)} onClick={onBack}>
        <BackIcon width="2rem" height="2rem" className={clsx(styles.icon)}/>
    </button>
    <h4 className={clsx(styles.headerTitle)}>{title}</h4>
   </header>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
}

export default Header;
