import Header from "~/components/Header";
import React from "react";
import AuthModal from "~/components/AuthModal";
import { useSelector } from "react-redux";
import { selectOpenform } from "~/store/features/formAuthSlice";
import clsx from "clsx";
import styles from "./HeaderOnly.module.scss";

export default function HeaderOnly({ children }) {
  const isOpen = useSelector(selectOpenform);
  return (
    <div className={clsx(styles.container)}>
      <Header />
      <div className={clsx(styles.main)}>
        <div className={clsx(styles.content)}>{children}</div>
      </div>
      <AuthModal isOpen={isOpen} />
    </div>
  );
}
