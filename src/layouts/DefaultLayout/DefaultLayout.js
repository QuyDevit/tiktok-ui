import Header from "~/components/Header";
import Sidebar from "~/components/Sidebar";
import clsx from "clsx";
import styles from "./DefaultLayout.module.scss";
import PropTypes from "prop-types";

import AuthModal from "~/components/AuthModal";
import { useSelector } from "react-redux";
import { selectOpenform } from "~/store/features/formAuthSlice";

export default function DefaultLayout({ children, isFullWidth = true }) {
  const isOpen = useSelector(selectOpenform);

  return (
    <div className={clsx(styles.wrapper)}>

      <Header isFullWidth={isFullWidth}/>
      <div className={clsx(styles.container, { "full-width": isFullWidth })}>
        <Sidebar />
        <div className={clsx(styles.content)}>{children}</div>
      </div>
      <AuthModal isOpen={isOpen} />
    </div>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
  isFullWidth: PropTypes.bool,
};
