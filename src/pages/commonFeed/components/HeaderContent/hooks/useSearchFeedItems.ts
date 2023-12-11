import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";
import { ToggleState, useToggle } from "@/shared/hooks";
import { commonActions } from "@/store/states";

interface Return {
  searchValue: string;
  searchInputToggle: ToggleState;
  onChangeSearchValue: (value: string) => void;
  onCloseSearch: () => void;
}

export const useSearchFeedItems = (): Return => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const searchInputToggle = useToggle(false);

  const searchFeedItems = debounce((value: string) => {
    dispatch(commonActions.searchFeedItems(value));
  }, 300);

  useEffect(() => {
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
