import Header from "~/components/Header";
import Sidebar from "~/components/Sidebar";
import { useState } from "react";
import clsx from "clsx";
import styles from "./DefaultLayout.module.scss";
import PropTypes from "prop-types";

import AuthModal from "~/components/AuthModal";

export default function DefaultLayout({ children, isFullWidth = true }) {
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <div className={clsx(styles.wrapper)}>

      <Header isFullWidth={isFullWidth} setIsOpenModal={setIsOpenModal} />
      <div className={clsx(styles.container, { "full-width": isFullWidth })}>
        <Sidebar />
        <div className={clsx(styles.content)}>{children}</div>
      </div>
      <AuthModal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} />
    </div>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
  isFullWidth: PropTypes.bool,
};
