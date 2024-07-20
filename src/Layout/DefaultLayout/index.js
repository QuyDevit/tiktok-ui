import Header from "~/Layout/components/Header";
import Sidebar from "~/Layout/components/Sidebar";
import React from "react";
import clsx from "clsx";
import styles from "./DefaultLayout.module.scss";

export default function DefaultLayout({ children }) {
  return (
    <div className={clsx(styles.wrapper)}>
      <Header />
      <div className={clsx(styles.container)}>
        <Sidebar />
        <div className={clsx(styles.content)}>{children}</div>
      </div>
    </div>
  );
}
