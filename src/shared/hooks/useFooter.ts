import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { SharedFooterState } from "@/shared/interfaces";
import {
  updateFooterState as updateFooterStateAction,
  resetFooterState,
} from "@/shared/store/actions";
import { useComponentWillUnmount } from "./useComponentWillUnmount";

interface Return {
  updateFooterState: (state: Partial<SharedFooterState>) => void;
}

export const useFooter = (): Return => {
  const dispatch = useDispatch();

  const updateFooterState = useCallback(
    (state: Partial<SharedFooterState>) => {
      dispatch(updateFooterStateAction(state));
    },
    [dispatch]
  );

  const handleUnmount = useCallback(() => {
    dispatch(resetFooterState());
  }, [dispatch]);

  useComponentWillUnmount(handleUnmount);

  return {
    updateFooterState,
  };
};
