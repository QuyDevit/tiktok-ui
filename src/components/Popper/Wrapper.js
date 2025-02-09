import React from "react";
import clsx from "clsx";
import styles from "./Popper.module.scss";
import PropTypes from "prop-types";

export default function Wrapper({ children,className }) {
  return <div className={clsx(styles.wrapper,className)}>{children}</div>;
}
Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}
