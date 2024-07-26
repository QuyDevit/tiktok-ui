import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faMagnifyingGlass,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import Tippy from "@tippyjs/react/headless";

import styles from "./Header.module.scss";
import images from "~/assets/images";
import { Wrapper as PopperWrapper } from "~/components/Popper";
import AccountItem from "~/components/AccountItem";

export default function Header() {
  const [searchResult, setsearchResult] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      setsearchResult([]);
    }, 500);
  }, []);
  // const [visible, setVisible] = useState(true);

  return (
    <header className={clsx(styles.wrapper)}>
      <div className={clsx(styles.inner)}>
        <div className={clsx(styles.mylogo)}>
          <img src={images.logo} alt="Logo"></img>
        </div>
        <Tippy
          interactive={true}
          visible={searchResult.length > 0}
          render={(attrs) => (
            <div className={clsx(styles.searchResult)} tabIndex="-1" {...attrs}>
              <PopperWrapper>
                <h4 className={clsx(styles.searchTitle)}>Accounts</h4>
                <AccountItem />
                <AccountItem />
                <AccountItem />
              </PopperWrapper>
            </div>
          )}
        >
          <div className={clsx(styles.search)}>
            <input placeholder="Search account and videos" spellCheck={false} />
            <button className={clsx(styles.clear)}>
              <FontAwesomeIcon icon={faCircleXmark} />
            </button>
            <FontAwesomeIcon
              className={clsx(styles.loading)}
              icon={faSpinner}
            />
            <button className={clsx(styles.searchBtn)}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
        </Tippy>
        <div className={clsx(styles.action)}>
          <div>
            <h1>Upload</h1>
          </div>
        </div>
      </div>
    </header>
  );
}
