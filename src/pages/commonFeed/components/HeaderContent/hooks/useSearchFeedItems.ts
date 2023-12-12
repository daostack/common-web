import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";
import { QueryParamKey } from "@/shared/constants";
import { ToggleState, useQueryParams, useToggle } from "@/shared/hooks";
import { addQueryParam, deleteQueryParam } from "@/shared/utils";
import { commonActions } from "@/store/states";

interface Return {
  searchValue: string;
  searchInputToggle: ToggleState;
  onChangeSearchValue: (value: string) => void;
  onCloseSearch: () => void;
}

export const useSearchFeedItems = (): Return => {
  const dispatch = useDispatch();
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

    dispatch(commonActions.searchFeedItems(value));
  }, 300);

  useEffect(() => {
    if (typeof searchParam === "string") {
      searchInputToggle.setToggleOn();
      onChangeSearchValue(searchParam);
    }

    return () => {
      dispatch(commonActions.resetSearchState());
    };
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
