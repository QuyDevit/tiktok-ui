import Tippy from "@tippyjs/react/headless";
import clsx from "clsx";
import styles from "./Menu.module.scss";
import { Wrapper as PopperWrapper } from "~/components/Popper";
import MenuItem from "./MenuItem";
import Header from "./Header";
import { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { selectTheme } from "~/store/features/themeSlice";
import { selectLanguage } from "~/store/features/languageSlice";

const defaultFn = () => {};
function Menu({
  children,
  items = [],
  hideOnClick = false,
  onChange = defaultFn,
}) {
  const isDarkMode = useSelector(selectTheme);
  const currentLanguage = useSelector(selectLanguage);
  const [history, setHistory] = useState([{ data: items, title: null }]);
  const current = history[history.length - 1];
  
  const renderItems = () => {
    return current.data.map((item, index) => {
      const isParent = !!item.children;
      let isSelected = false;
      if (!isParent && item.mode) {
        isSelected =
          (item.mode === "dark" && isDarkMode) ||
          (item.mode === "light" && !isDarkMode);
      } else if (!isParent && item.code) {
        isSelected = item.code === currentLanguage;
      }
      return (
        <MenuItem
          key={index}
          data={{ ...item, isSelected }}
          onClick={() => {
            if (isParent) {
              setHistory((prev) => [...prev, item.children]);
            } else {
              onChange(item);
            }
          }}
        ></MenuItem>
      );
    });
  };

  const handleBack = () => {
    setHistory((prev) => prev.slice(0, -1));
  };

  const renderResult = (attrs) => (
    <div className={clsx(styles.content)} tabIndex="-1" {...attrs}>
      <PopperWrapper className={clsx(styles.menuPopper)}>
        {history.length > 1 && (
          <Header title={current.title} onBack={handleBack} />
        )}
        <div className={clsx(styles.menuBody)}>{renderItems()}</div>
      </PopperWrapper>
    </div>
  );

  // Render to first page
  const handleReset = () => {
    setHistory((prev) => prev.slice(0, 1));
  };

  return (
    <Tippy
      interactive
      hideOnClick={hideOnClick}
      delay={[0, 700]}
      offset={[12, 8]}
      placement="bottom-end"
      render={renderResult}
      onHide={handleReset}
    >
      {children}
    </Tippy>
  );
}

Menu.propTypes = {
  children: PropTypes.node.isRequired,
  items: PropTypes.array,
  hideOnClick: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Menu;
