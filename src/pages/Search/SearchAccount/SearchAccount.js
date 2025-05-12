import clsx from "clsx";
import styles from "../Search.module.scss";
import SearchAccountItem from "~/components/SearchAccountItem";
import TabSearch from "../TabSearch/TabSearch";
import { useSearch } from "~/hooks/useSearch";

function SearchAccount() {
  const { searchResult } = useSearch();

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
