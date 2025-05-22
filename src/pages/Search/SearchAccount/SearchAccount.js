import clsx from "clsx";
import styles from "../Search.module.scss";
import SearchAccountItem from "~/components/SearchAccountItem";
import TabSearch from "../TabSearch/TabSearch";
import { useSearch } from "~/hooks/useSearch";

function SearchAccount({ hideTabSearch }) {
  const { searchResult } = useSearch("user");

  return (
    <div
      className={clsx(styles.container)}
      style={hideTabSearch && { padding: 0 }}
    >
      {!hideTabSearch && <TabSearch />}
      <div className={clsx(styles.divBlockContainer)}>
        <div className={clsx(styles.titleContainer)}>
          <h2>Người dùng</h2>
        </div>
        {searchResult && searchResult.length > 0 ? (
          searchResult.map((item) => (
            <SearchAccountItem key={item.id} data={item} />
          ))
        ) : (
          <div className={clsx(styles.divEmpty)}>
            {searchResult === null
              ? "Nhập từ khóa để tìm kiếm người dùng"
              : "Không tìm thấy người dùng."}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchAccount;
