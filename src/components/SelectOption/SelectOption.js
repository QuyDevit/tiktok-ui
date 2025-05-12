import clsx from "clsx";
import styles from "./SelectOption.module.scss";
import Tippy from "@tippyjs/react/headless";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Wrapper as PopperWrapper } from "~/components/Popper";
import { useState } from "react";

export default function SelectOption({
  offset,
  width = 280,
  options = [],
  onSelect,
}) {
  const [visible, setVisible] = useState(false);
  const [selectedCode, setSelectedCode] = useState(options[0]?.code || "");

  const handleSelect = (option) => {
    setSelectedCode(option.code);
    onSelect?.(option.code);
    setVisible(false);
  };

  const selectedOption = options.find((opt) => opt.code === selectedCode);
  return (
    <Tippy
      visible={visible}
      offset={offset}
      appendTo={document.body}
      interactive
      onClickOutside={() => setVisible(false)}
      delay={[800, 0]}
      placement="bottom"
      render={(props) => (
        <div tabIndex="-1" {...props}>
          <PopperWrapper>
            <ul className={clsx(styles.container)} style={{ width: width }}>
              {options.map((option, index) => (
                <li
                  key={option.code}
                  className={clsx(styles.item, {
                    [styles.active]: option.code === selectedCode,
                  })}
                  onClick={() => handleSelect(option)}
                >
                  <span className={clsx(styles.text)}>{option.text}</span>
                  {option.code === selectedCode && (
                    <span>
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </PopperWrapper>
        </div>
      )}
    >
      <div className={clsx(styles.selectStatus)}>
        <button
          className={clsx(styles.selectBtn)}
          onClick={() => setVisible((prev) => !prev)}
        >
          <div className={clsx(styles.selectDiv)}>
            <div>{selectedOption?.text}</div>
          </div>
          <span>
            <FontAwesomeIcon
              className={clsx(styles.check)}
              icon={faChevronDown}
            />
          </span>
        </button>
      </div>
    </Tippy>
  );
}
