import React from "react";
import styles from "./AccountItem.module.scss";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export default function AccountItem() {
  return (
    <div className={clsx(styles.wrapper)}>
      <img
        className={clsx(styles.avatar)}
        src="https://cellphones.com.vn/sforum/wp-content/uploads/2022/09/11.jpg"
        alt="Name"
      />
      <div className={clsx(styles.info)}>
        <h4 className={clsx(styles.name)}>
          <span>Nguyễn Văn A</span>
          <FontAwesomeIcon
            className={clsx(styles.check)}
            icon={faCheckCircle}
          />
        </h4>
        <span className={clsx(styles.username)}>nguyenvana</span>
      </div>
    </div>
  );
}
