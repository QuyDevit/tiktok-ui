import { useEffect, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!q && query) {
      dispatch(setKeyWordSearch(query));
    }
  }, [q, query, dispatch]);

  const loadMore = async () => {
    if (isLoading || !query) return;

    const currentResults = searchResults[type];
    if (!currentResults || !currentResults.hasMore) return;

    setIsLoading(true);
    try {
      let result;
      if (type === "user") {
        result = await searchUser(
          query,
          "more",
          currentResults.nextSearchAfter
        );
      } else if (type === "video") {
        result = await searchVideo(
          query,
          "more",
          currentResults.nextSearchAfter
        );
      }

      dispatch(
        setSearchResults({
          type,
          results: {
            data: [...currentResults.data, ...result.data],
            query,
            hasMore: result.hasMore,
            nextSearchAfter: result.nextSearchAfter,
          },
        })
      );
    } catch (error) {
      console.error("Load more error:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
        if (type === "user") {
          // Nếu là trang user, chỉ gọi API user
          const result = await searchUser(query, "more");

          dispatch(
            setSearchResults({
              type,
              results: {
                data: result.data,
                query,
                hasMore: result.hasMore,
                nextSearchAfter: result.nextSearchAfter,
              },
            })
          );
        } else if (type === "video") {
          // Nếu là trang video, chỉ gọi API video
          const result = await searchVideo(query, "more");
          dispatch(
            setSearchResults({
              type,
              results: {
                data: result.data,
                query,
                hasMore: result.hasMore,
                nextSearchAfter: result.nextSearchAfter,
              },
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
  }, [query, type]);

  useEffect(() => {
    document.title = pagesTitle[routes.search](query || "");
  }, [query]);

  return {
    searchResult: searchResults[type] || [],
    query,
    loadMore,
    isLoading,
  };
};
