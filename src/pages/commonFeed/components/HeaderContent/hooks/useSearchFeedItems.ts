import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { QueryParamKey } from "@/shared/constants";
import { ToggleState, useQueryParams, useToggle } from "@/shared/hooks";
import { addQueryParam, deleteQueryParam } from "@/shared/utils";

interface Options {
  onSearch: (value: string) => void;
  onResetSearchState: () => void;
}

interface Return {
  searchValue: string;
  searchInputToggle: ToggleState;
  onChangeSearchValue: (value: string) => void;
  onCloseSearch: () => void;
}

export const useSearchFeedItems = ({
  onSearch,
  onResetSearchState,
}: Options): Return => {
  const params = useQueryParams();
  const searchParam = params[QueryParamKey.Search];
  const [searchValue, setSearchValue] = useState("");
  const searchInputToggle = useToggle(false);

  const searchFeedItems = debounce((value: string) => {
    if (value) {
      addQueryParam(QueryParamKey.Search, value);
    } else {
      deleteQueryParam(QueryParamKey.Search);
    }

    onSearch(value);
  }, 300);

  useEffect(() => {
    if (typeof searchParam === "string") {
      searchInputToggle.setToggleOn();
      onChangeSearchValue(searchParam);
    }

    return onResetSearchState;
  }, []);

  const onChangeSearchValue = useCallback((value: string) => {
    setSearchValue(value);
    searchFeedItems(value);
  }, []);

  const onCloseSearch = useCallback(() => {
    searchInputToggle.setToggleOff();
    onChangeSearchValue("");
  }, []);

  return {
    searchValue,
    searchInputToggle,
    onChangeSearchValue,
    onCloseSearch,
  };
};
