import PostItem from "~/components/PostItem";
import TabSearch from "../TabSearch/TabSearch";
import clsx from "clsx";
import styles from "../Search.module.scss";
import { useSelector } from "react-redux";
import { selectkeywordSearch } from "~/store/features/homeSlice";
import { useSearchParams } from "react-router-dom";

function SearchVideo() {
  const [searchParams] = useSearchParams();
  const query = useSelector(selectkeywordSearch) || searchParams.get("q");

  return (
    <div className={clsx(styles.container)}>
      <TabSearch />
      <div className={clsx(styles.divBlockContainer)}>
        <PostItem />
      </div>
    </div>
  );
}

export default SearchVideo;
