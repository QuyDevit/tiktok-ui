import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import "tippy.js/dist/tippy.css";
import styles from "./Header.module.scss";
import {
  LogoIcon,
} from "~/components/Icons";
import Search from "../Search";
import config from "~/config";
import { useDispatch, useSelector } from "react-redux";
import { setTheme, selectTheme } from "~/store/features/themeSlice";
import { setLanguage } from "~/store/features/languageSlice";
import { refreshHome } from "~/store/features/homeSlice";
import { HEADER_MENU_ITEMS, USER_MENU_ITEMS } from "./constants";
import HeaderAction from "./HeaderAction";
import HeaderMenu from "./HeaderMenu";
import HeaderMobile from "./HeaderMobile";
import { selectUser } from "~/store/features/authSlice";
import { logoutuser } from "~/services/auth/logout";
import * as authHelper from"~/helpers"

export default function Header({ isFullWidth = false,setIsOpenModal  }) {
  const dispatch = useDispatch();
  const isDarkMode = useSelector(selectTheme);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentUser =  useSelector(selectUser);
  
  useEffect(() => {
    document.body.className = isDarkMode ? "darkMode" : "lightMode";
  }, [isDarkMode]);

  const handleMenuChange = async(menuItem) => {
    if (menuItem.mode) {
      dispatch(setTheme(menuItem.mode));
    } else if (menuItem.code) {
      dispatch(setLanguage(menuItem.code));
    } else if(menuItem.to === "/logout"){
      const result = await logoutuser();
      if(result.success){
        authHelper.authcookie.clearRefreshToken();
        window.location.reload();
      }
    }
  };
  return (
    <header className={clsx(styles.wrapper)}>
      <div className={clsx(styles.inner, { "full-width": isFullWidth })}>
        <Link
          to={config.routes.home}
          className={clsx(styles.logoLink)}
          onClick={() => dispatch(refreshHome())}
        >
          <LogoIcon className={clsx(styles.icon)} />
        </Link>

        <Search />

        <HeaderAction currentUser={currentUser} setIsOpenModal={setIsOpenModal} isMobile={false}>
          <HeaderMenu
            currentUser={currentUser}
            menuItems={currentUser ? USER_MENU_ITEMS : HEADER_MENU_ITEMS}
            handleMenuChange={handleMenuChange}
          />
        </HeaderAction>

        <HeaderMobile
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          currentUser={currentUser}
          setIsOpenModal={setIsOpenModal}
        >
          <HeaderMenu
            currentUser={currentUser}
            menuItems={currentUser ? USER_MENU_ITEMS : HEADER_MENU_ITEMS}
            handleMenuChange={handleMenuChange}
          />
        </HeaderMobile>
      </div>
    </header>
  );
}
