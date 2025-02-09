import React from "react";
import { Link } from "react-router-dom";
import styles from "./Button.module.scss";
import clsx from "clsx";
import PropTypes from "prop-types";

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
  }else{
    props.disabled = disabled;
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

Button.propTypes = {
  to: PropTypes.string,
  href: PropTypes.string,
  primary: PropTypes.bool,
  outline: PropTypes.bool,
  large: PropTypes.bool,
  small: PropTypes.bool,
  text: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  rounded: PropTypes.string,
  className: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  onClick: PropTypes.func,
};