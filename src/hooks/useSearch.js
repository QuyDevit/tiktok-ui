import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectkeywordSearch,
  setKeyWordSearch,
} from "~/store/features/homeSlice";
import { useSearchParams } from "react-router-dom";
import * as searchService from "~/services/searchService";
import routes, { pagesTitle } from "~/config/routes";

export const useSearch = () => {
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
  }, [query]);

  useEffect(() => {
    document.title = pagesTitle[routes.search](query || "");
  }, [query]);

  return {
    searchResult,
    query,
  };
};
