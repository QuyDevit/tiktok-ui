import PostItem from "~/components/PostItem";
import TabSearch from "../TabSearch/TabSearch";
import clsx from "clsx";
import styles from "../Search.module.scss";
import { useSearch } from "~/hooks/useSearch";

function SearchVideo() {
  const { searchResult } = useSearch();

  return (
    <div className={clsx(styles.container)}>
      <TabSearch />
      <div className={clsx(styles.divBlockContainer)}>
        {searchResult.length > 0 ? (
          searchResult.map((item) => <PostItem key={item.id} data={item} />)
        ) : (
          <div className={clsx(styles.divEmpty)}>Không tìm thấy video.</div>
        )}
      </div>
    </div>
  );
}

export default SearchVideo;
