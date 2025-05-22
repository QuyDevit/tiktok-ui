import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectkeywordSearch,
  setKeyWordSearch,
  setSearchResults,
  selectSearchResults,
} from "~/store/features/homeSlice";
import { useSearchParams } from "react-router-dom";
import { searchUser, searchVideo } from "~/services/searchService";
import routes, { pagesTitle } from "~/config/routes";

export const useSearch = (type = "all") => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const q = useSelector(selectkeywordSearch);
  const query = q || searchParams.get("q");
  const searchResults = useSelector(selectSearchResults);

  useEffect(() => {
    if (!q && query) {
      dispatch(setKeyWordSearch(query));
    }
  }, [q, query, dispatch]);

  useEffect(() => {
    const fetchApi = async () => {
      if (!query) {
        dispatch(setSearchResults({ type, results: [] }));
        return;
      }

      // Kiểm tra cache: chỉ dùng cache nếu query giống nhau
      const cachedResults = searchResults[type];
      if (cachedResults && cachedResults.query === query) {
        return;
      }

      try {
        // Nếu là trang search chính (type === 'all'), gọi cả 2 API
        if (type === "all") {
          const [userResults, videoResults] = await Promise.all([
            searchUser(query, "more"),
            searchVideo(query, "more"),
          ]);
          dispatch(
            setSearchResults({
              type: "user",
              results: { data: userResults, query },
            })
          );
          dispatch(
            setSearchResults({
              type: "video",
              results: { data: videoResults, query },
            })
          );
        } else if (type === "user") {
          // Nếu là trang user, chỉ gọi API user
          const result = await searchUser(query, "more");
          dispatch(
            setSearchResults({
              type,
              results: { data: result, query },
            })
          );
        } else if (type === "video") {
          // Nếu là trang video, chỉ gọi API video
          const result = await searchVideo(query, "more");
          dispatch(
            setSearchResults({
              type,
              results: { data: result, query },
            })
          );
        }
      } catch (error) {
        console.error("Search error:", error);
        dispatch(
          setSearchResults({
            type,
            results: { data: [], query },
          })
        );
      }
    };
    fetchApi();
  }, [query, type, dispatch, searchResults]);

  useEffect(() => {
    document.title = pagesTitle[routes.search](query || "");
  }, [query]);

  return {
    searchResult: searchResults[type]?.data || [],
    query,
  };
};
