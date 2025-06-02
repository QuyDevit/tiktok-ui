import clsx from "clsx";
import styles from "../Search.module.scss";
import SearchAccountItem from "~/components/SearchAccountItem";
import TabSearch from "../TabSearch/TabSearch";
import { useSearch } from "~/hooks/useSearch";

function SearchAccount({ hideTabSearch }) {
  const { searchResult, loadMore, isLoading } = useSearch("user");

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
        {searchResult.data && searchResult.data.length > 0 ? (
          searchResult.data.map((item) => (
            <SearchAccountItem key={item.id} data={item} />
          ))
        ) : (
          <div className={clsx(styles.divEmpty)}>
            {searchResult.data === null
              ? "Nhập từ khóa để tìm kiếm người dùng"
              : "Không tìm thấy người dùng."}
          </div>
        )}
        {searchResult.hasMore && (
          <button
            className={clsx(styles.loadMoreBtn)}
            onClick={loadMore}
            disabled={isLoading}
          >
            {isLoading ? "Đang tải..." : "Xem thêm"}
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchAccount;
