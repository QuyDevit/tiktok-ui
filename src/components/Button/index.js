import React from "react";
import { Link } from "react-router-dom";
import styles from "./Button.module.scss";
import clsx from "clsx";

export default function Button({
  to,
  href,
  primary = false,
  outline = false,
  large = false,
  small = false,
  text = false,
  disabled = false,
  children,
  rounded = false,
  className,
  leftIcon,
  rightIcon,
  onClick,
  ...passProps
}) {
  let Comp = "button";
  const props = {
    onClick,
    ...passProps,
  };
  if (disabled) {
    Object.keys(props).forEach((key) => {
      if (key.startsWith("on") && typeof props[key] === "function") {
        delete props[key];
      }
    });
  }

  if (to) {
    props.to = to;
    Comp = Link;
  } else if (href) {
    props.href = href;
    Comp = "a";
  }
  const classes = clsx(
    styles.wrapper,
    {
      [styles.primary]: primary,
      [styles.outline]: outline,
      [styles.small]: small,
      [styles.large]: large,
      [styles.text]: text,
      [styles.disabled]: disabled,
      [styles.rounded]: rounded,
    },
    className
  );
  return (
    <Comp className={classes} {...props}>
      {leftIcon && <span className={clsx(styles.icon)}>{leftIcon}</span>}
      <span className={clsx(styles.title)}>{children}</span>
      {rightIcon && <span className={clsx(styles.icon)}>{rightIcon}</span>}
    </Comp>
  );
}
