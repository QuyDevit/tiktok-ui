import Tippy from "@tippyjs/react/headless";
import { SearchIcon } from "../Icons";
import { Wrapper as PopperWrapper } from "~/components/Popper";
import clsx from "clsx";

import styles from "./PhoneCountrySelect.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
const PHONECOUNTRY_OPTIONS = [
  { name: "Argentina (+54)", code: "54", abbr: "AR" },
  { name: "Australia (+61)", code: "61", abbr: "AU" },
  { name: "Austria (+43)", code: "43", abbr: "AT" },
  { name: "Bangladesh (+880)", code: "880", abbr: "BD" },
  { name: "Belgium (+32)", code: "32", abbr: "BE" },
  { name: "Brazil (+55)", code: "55", abbr: "BR" },
  { name: "Cambodia (+855)", code: "855", abbr: "KH" },
  { name: "Canada (+1)", code: "1", abbr: "CA" },
  { name: "Chile (+56)", code: "56", abbr: "CL" },
  { name: "China (+86)", code: "86", abbr: "CN" },
  { name: "Colombia (+57)", code: "57", abbr: "CO" },
  { name: "Denmark (+45)", code: "45", abbr: "DK" },
  { name: "Egypt (+20)", code: "20", abbr: "EG" },
  { name: "Finland (+358)", code: "358", abbr: "FI" },
  { name: "France (+33)", code: "33", abbr: "FR" },
  { name: "Germany (+49)", code: "49", abbr: "DE" },
  { name: "India (+91)", code: "91", abbr: "IN" },
  { name: "Indonesia (+62)", code: "62", abbr: "ID" },
  { name: "Italy (+39)", code: "39", abbr: "IT" },
  { name: "Japan (+81)", code: "81", abbr: "JP" },
  { name: "Kenya (+254)", code: "254", abbr: "KE" },
  { name: "Laos (+856)", code: "856", abbr: "LA" },
  { name: "Malaysia (+60)", code: "60", abbr: "MY" },
  { name: "Mexico (+52)", code: "52", abbr: "MX" },
  { name: "Morocco (+212)", code: "212", abbr: "MA" },
  { name: "Myanmar (+95)", code: "95", abbr: "MM" },
  { name: "Nepal (+977)", code: "977", abbr: "NP" },
  { name: "Netherlands (+31)", code: "31", abbr: "NL" },
  { name: "New Zealand (+64)", code: "64", abbr: "NZ" },
  { name: "Nigeria (+234)", code: "234", abbr: "NG" },
  { name: "Norway (+47)", code: "47", abbr: "NO" },
  { name: "Pakistan (+92)", code: "92", abbr: "PK" },
  { name: "Peru (+51)", code: "51", abbr: "PE" },
  { name: "Philippines (+63)", code: "63", abbr: "PH" },
  { name: "Portugal (+351)", code: "351", abbr: "PT" },
  { name: "Russia (+7)", code: "7", abbr: "RU" },
  { name: "Saudi Arabia (+966)", code: "966", abbr: "SA" },
  { name: "Singapore (+65)", code: "65", abbr: "SG" },
  { name: "South Africa (+27)", code: "27", abbr: "ZA" },
  { name: "South Korea (+82)", code: "82", abbr: "KR" },
  { name: "Spain (+34)", code: "34", abbr: "ES" },
  { name: "Sri Lanka (+94)", code: "94", abbr: "LK" },
  { name: "Sweden (+46)", code: "46", abbr: "SE" },
  { name: "Switzerland (+41)", code: "41", abbr: "CH" },
  { name: "Thailand (+66)", code: "66", abbr: "TH" },
  { name: "Turkey (+90)", code: "90", abbr: "TR" },
  { name: "Ukraine (+380)", code: "380", abbr: "UA" },
  { name: "United Arab Emirates (+971)", code: "971", abbr: "AE" },
  { name: "United Kingdom (+44)", code: "44", abbr: "GB" },
  { name: "United States (+1)", code: "1", abbr: "US" },
  { name: "Venezuela (+58)", code: "58", abbr: "VE" },
  { name: "Vietnam (+84)", code: "84", abbr: "VN" },
];

function PhoneCountrySelect({ children, showSelection,onSelect ,selectedCountry }) {
  const [result, setResult] = useState(PHONECOUNTRY_OPTIONS);
  const [searchValue, setSearchValue] = useState("");
  const handleOptionClick = (option) => {
    onSelect(option);
  };
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(e.target.value);
    const filteredResults = PHONECOUNTRY_OPTIONS.filter((option) =>
      option.name.toLowerCase().includes(value)
    );
    setResult(
      filteredResults.length > 0
        ? filteredResults
        : [
            {
              name: "Không có kết quả",
              code: "empty",
              abbr: "",
            },
          ]
    );
  };
  return (
    <div className={clsx(styles.container)}>
      <Tippy
        visible={showSelection}
        interactive
        placement="bottom-start"
        onClickOutside={() => handleOptionClick()}
        render={(attrs) => {
          return (
            <div className={clsx(styles.content)} tabIndex="-1" {...attrs}>
              <PopperWrapper className={clsx(styles.selectionWrapper)}>
                <div className={clsx(styles.divSearch)}>
                  <div className={clsx(styles.iconSearch)}>
                    <SearchIcon width="1.4rem" height="1.4rem" />
                  </div>
                  <div className={clsx(styles.searchInput)}>
                    <input
                      type="text"
                      placeholder="Tìm kiếm"
                      value={searchValue}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
                <div className={clsx(styles.listWrapper)}>
                  <ul className={clsx(styles.listSelection)}>
                    {result.map((option) => {
                      const { name, code } = option;
                      const lowerSearchValue = searchValue.toLowerCase();
                      const parts = name.split(
                        new RegExp(`(${searchValue})`, "gi")
                      );
                      return (
                        <li
                          key={`${code}-${option.abbr}`}
                          className={clsx(styles.listItem, {
                            [styles.noResult]: code === "empty",
                          })}
                          onClick={() =>handleOptionClick(option)}
                        >
                          <span>
                            {code === "empty"
                              ? name
                              : parts.map((part, index) =>
                                  part.toLowerCase() === lowerSearchValue ? (
                                    <span
                                      key={index}
                                      className={clsx(styles.highlight)}
                                    >
                                      {part}
                                    </span>
                                  ) : (
                                    part
                                  )
                                )}
                          </span>
                          {option.code === selectedCountry.code && (
                            <span className={clsx(styles.iconSelection)}>
                              <FontAwesomeIcon icon={faCheck} />
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </PopperWrapper>
            </div>
          );
        }}
      >
        {children}
      </Tippy>
    </div>
  );
}

export default PhoneCountrySelect;
