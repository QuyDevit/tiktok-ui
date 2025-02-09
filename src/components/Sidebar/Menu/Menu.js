import PropTypes from "prop-types";
import clsx from "clsx";
import styles from "./Menu.module.scss";
function Menu({ children }) {
  return <nav className={clsx(styles.sidebarNav)}>{children}</nav>;
}

Menu.protTypes = {
  children: PropTypes.node.isRequired,
};
export default Menu;
