import clsx from "clsx";
import styles from "../Search.module.scss";
import SearchAccountItem from "~/components/SearchAccountItem";
import TabSearch from "../TabSearch/TabSearch";
import { useDispatch, useSelector } from "react-redux";
import { selectkeywordSearch, setKeyWordSearch } from "~/store/features/homeSlice";
import { useEffect, useState } from "react";
import * as searchService from "~/services/searchService";
import { useSearchParams } from "react-router-dom";
function SearchAccount() {
  const dispatch = useDispatch();
  const [searchResult, setSearchResult] = useState([]);
  const [searchParams] = useSearchParams();
  const q = useSelector(selectkeywordSearch);
  const query = q || searchParams.get("q");
  useEffect(() => {
    if (!q) {
      dispatch(setKeyWordSearch(query));
    }
    const fetchApi = async () => {
      const result = await searchService.search(query);
      setSearchResult(result);
    };
    fetchApi();
  }, []);
  return (
    <div className={clsx(styles.container)}>
      <TabSearch />
      <div className={clsx(styles.divBlockContainer)}>
        {searchResult.length > 0 ? (
          searchResult.map((item) => (
            <SearchAccountItem key={item.id} data={item} />
          ))
        ) : (
          <div className={clsx(styles.divEmpty)}>
            Không tìm thấy người dùng.
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchAccount;
