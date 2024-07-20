import React from "react";
import clsx from "clsx";
import styles from "./Header.module.scss";
import images from "~/assets/images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faMagnifyingGlass,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  return (
    <header className={clsx(styles.wrapper)}>
      <div className={clsx(styles.inner)}>
        <div className={clsx(styles.mylogo)}>
          <img src={images.logo} alt="Logo"></img>
        </div>
        <div className={clsx(styles.search)}>
          <input placeholder="Search account and videos" spellCheck={false} />
          <button className={clsx(styles.clear)}>
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
          <FontAwesomeIcon className={clsx(styles.loading)} icon={faSpinner} />
          <button className={clsx(styles.searchBtn)}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
        <div className={clsx(styles.action)}>
          <div>
            <h1>Upload</h1>
          </div>
        </div>
      </div>
    </header>
  );
}
