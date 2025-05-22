import HeadlessTippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css";
import clsx from "clsx";

import styles from "./Search.module.scss";
import { Wrapper as PopperWrapper } from "~/components/Popper";
import AccountItem from "~/components/AccountItem";
import { DeleteIcon, LoadingIcon, SearchIcon } from "~/components/Icons";
import { useEffect, useRef, useState } from "react";

import { useDebounce } from "~/hooks";
import { searchUser } from "~/services/searchService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setKeyWordSearch,
  setTabSearchIndex,
} from "~/store/features/homeSlice";
function Search() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const debouncedValue = useDebounce(searchValue, 500);

  const inputRef = useRef();
  useEffect(() => {
    if (!searchValue.trim()) {
      setSearchResult([]);
      return;
    }

    const fetchApi = async () => {
      setLoading(true);
      const result = await searchUser(debouncedValue);
      setSearchResult(result);
      setLoading(false);
    };

    fetchApi();
  }, [debouncedValue]);

  const handleClear = () => {
    setSearchValue("");
    setSearchResult([]);
    inputRef.current.focus();
  };

  const handleHideResult = () => {
    setShowResult(false);
  };

  const handleChange = (e) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(" ")) {
      setSearchValue(e.target.value);
    }
  };
  const handleSearch = () => {
    if (!searchValue.trim()) return;
    dispatch(setTabSearchIndex(0));
    dispatch(setKeyWordSearch(searchValue));
    setShowResult(false);
    navigate("/search?q=" + searchValue);
  };
  return (
    //Using a wrapper <div> or <span> tag around the reference element solves this by creating a new parentNode context.
    <div>
      <HeadlessTippy
        interactive
        visible={showResult && searchResult.length > 0}
        render={(attrs) => (
          <div className={clsx(styles.searchResult)} tabIndex="-1" {...attrs}>
            <PopperWrapper>
              <h4 className={clsx(styles.searchTitle)}>Accounts</h4>
              {searchResult.map((result) => (
                <AccountItem
                  key={result.id}
                  data={result}
                  onClick={() => setShowResult(false)}
                />
              ))}
              <button className={clsx(styles.viewAll)} onClick={handleSearch}>
                <span>Xem tất cả các kết quả cho "{searchValue}"</span>
              </button>
            </PopperWrapper>
          </div>
        )}
        onClickOutside={handleHideResult}
      >
        <div className={clsx(styles.search)}>
          <input
            ref={inputRef}
            value={searchValue}
            placeholder="Tìm kiếm"
            spellCheck={false}
            onChange={handleChange}
            onFocus={() => setShowResult(true)}
          />
          {!!searchValue && !loading && (
            <button className={clsx(styles.clear)} onClick={handleClear}>
              <DeleteIcon
                width="1.6rem"
                height="1.6rem"
                className={clsx(styles.icon)}
              />
            </button>
          )}
          {loading && (
            <span className={clsx(styles.loading)}>
              <LoadingIcon
                width="1.6rem"
                height="1.6rem"
                className={clsx(styles.icon)}
              />
            </span>
          )}

          <button
            className={clsx(styles.searchBtn)}
            onMouseDown={(e) => e.preventDefault()}
          >
            <SearchIcon
              width="2.4rem"
              height="2.4rem"
              className={clsx(styles.icon)}
            />
          </button>
        </div>
      </HeadlessTippy>
    </div>
  );
}

export default Search;
