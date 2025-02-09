import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import styles from "./Menu.module.scss";

function MenuItem({ title, to, icon, activeIcon = icon,...props }) {
  return (
    <NavLink {...props}
      className={(nav) =>
        clsx(styles.menuItem, { [styles.active]: nav.isActive })
      }
      to={to}
    >
      {({ isActive }) => (
        <>
          {!isActive ? icon : activeIcon}
          <span className={clsx(styles.title)}>{title}</span>
        </>
      )}
    </NavLink>
  );
}

MenuItem.propTypes = {
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
};

export default MenuItem;
