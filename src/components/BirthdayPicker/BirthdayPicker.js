import { useState, useCallback, useMemo } from "react";
import clsx from "clsx";
import styles from "./BirthdayPicker.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import Tippy from "@tippyjs/react/headless";
import { Wrapper as PopperWrapper } from "~/components/Popper";

const MONTHS = [
  { label: "Một", value: 1 },
  { label: "Hai", value: 2 },
  { label: "Ba", value: 3 },
  { label: "Tư", value: 4 },
  { label: "Năm", value: 5 },
  { label: "Sáu", value: 6 },
  { label: "Bảy", value: 7 },
  { label: "Tám", value: 8 },
  { label: "Chín", value: 9 },
  { label: "Mười", value: 10 },
  { label: "Mười một", value: 11 },
  { label: "Mười hai", value: 12 },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - i);

const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

function BirthdayPicker({ onChange }) {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [visiblePopper, setVisiblePopper] = useState(null);

  const days = useMemo(() => {
    if (!selectedMonth) return Array.from({ length: 31 }, (_, i) => i + 1);
    return Array.from(
      { length: getDaysInMonth(selectedMonth, selectedYear) },
      (_, i) => i + 1
    );
  }, [selectedMonth, selectedYear]);

  const handleSelect = useCallback(
    (type, value) => {
      switch (type) {
        case "month":
          setSelectedMonth(value);
          setSelectedDay(null);
          break;
        case "day":
          setSelectedDay(value);
          break;
        case "year":
          setSelectedYear(value);
          break;
      }
      setVisiblePopper(null);

      if (onChange) {
        onChange({
          month: type === "month" ? value : selectedMonth,
          day: type === "day" ? value : selectedDay,
          year: type === "year" ? value : selectedYear,
        });
      }
    },
    [selectedMonth, selectedDay, selectedYear, onChange]
  );

  const renderOptions = useCallback(
    (items, type, selectedValue) => (
      <PopperWrapper className={clsx(styles.selectionWrapper)}>
        {items.map(({ label, value }) => (
          <div
            key={value}
            className={clsx(styles.divOption)}
            onClick={() => handleSelect(type, value)}
          >
            <span className={clsx(styles.label)}>{label}</span>
            {value === selectedValue && (
              <span className={clsx(styles.icon)}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
            )}
          </div>
        ))}
      </PopperWrapper>
    ),
    [handleSelect]
  );

  const renderSelector = useCallback(
    (label, type, value, items) => (
      <div>
        <Tippy
          visible={visiblePopper === type}
          interactive
          placement="bottom-start"
          offset={[0, 4]}
          onClickOutside={() => setVisiblePopper(null)}
          render={(attrs) => (
            <div className={clsx(styles.content)} tabIndex="-1" {...attrs}>
              {renderOptions(items, type, value)}
            </div>
          )}
        >
          <div
            className={clsx(styles.divSelectLabel)}
            onClick={() =>
              setVisiblePopper(visiblePopper === type ? null : type)
            }
          >
            <span>
              {value
                ? items.find((item) => item.value === value)?.label || value
                : label}
            </span>
            <span className={clsx(styles.iconSelection)}>
              <FontAwesomeIcon icon={faCaretDown} />
            </span>
          </div>
        </Tippy>
      </div>
    ),
    [visiblePopper, renderOptions]
  );

  return (
    <div className={clsx(styles.container)}>
      {renderSelector("Tháng", "month", selectedMonth, MONTHS)}
      {renderSelector(
        "Ngày",
        "day",
        selectedDay,
        days.map((d) => ({ label: d, value: d }))
      )}
      {renderSelector(
        "Năm",
        "year",
        selectedYear,
        YEARS.map((y) => ({ label: y, value: y }))
      )}
    </div>
  );
}

export default BirthdayPicker;
