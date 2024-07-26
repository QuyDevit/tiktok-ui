import React from "react";
import clsx from "clsx";
import styles from "./Popper.module.scss";

export default function Wrapper({ children }) {
  return <div className={clsx(styles.wrapper)}>{children}</div>;
}
