import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleQuestion,
  faLanguage,
  faMoon,
  faUser,
  faCoins,
  faGear,
  faSignOut
} from "@fortawesome/free-solid-svg-icons";

export const LANGUAGE_OPTIONS = [
  { code: "vi", title: "Tiếng Việt" },
  { code: "en", title: "Tiếng Anh" }
];

export const THEME_OPTIONS = [
  { mode: "light", title: "Chế độ sáng" },
  { mode: "dark", title: "Chế độ tối" }
];

export const HEADER_MENU_ITEMS = [
  {
    icon: <FontAwesomeIcon icon={faLanguage} />,
    title: "Ngôn ngữ",
    children: {
      title: "Ngôn ngữ",
      data: LANGUAGE_OPTIONS
    }
  },
  {
    icon: <FontAwesomeIcon icon={faCircleQuestion} />,
    title: "Trợ giúp",
    to: "/feedback"
  },
  {
    icon: <FontAwesomeIcon icon={faMoon} />,
    title: "Chế độ",
    children: {
      title: "Chế độ",
      data: THEME_OPTIONS
    }
  }
];

export const USER_MENU_ITEMS = [
  {
    icon: <FontAwesomeIcon icon={faUser} />,
    title: "Hồ sơ",
    to: "/profile"
  },
  {
    icon: <FontAwesomeIcon icon={faCoins} />,
    title: "Nhận xu",
    to: "/coin"
  },
  {
    icon: <FontAwesomeIcon icon={faGear} />,
    title: "Cài đặt",
    to: "/settings"
  },
  ...HEADER_MENU_ITEMS,
  {
    icon: <FontAwesomeIcon icon={faSignOut} />,
    title: "Đăng xuất",
    to: "/logout",
    separate: true
  }
];