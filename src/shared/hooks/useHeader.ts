import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { SharedHeaderState } from "@/shared/interfaces";
import {
  updateHeaderState as updateHeaderStateAction,
  resetHeaderState,
} from "@/shared/store/actions";
import { useComponentWillUnmount } from "./useComponentWillUnmount";

interface Return {
  updateHeaderState: (state: Partial<SharedHeaderState>) => void;
}

export const useHeader = (): Return => {
  const dispatch = useDispatch();

  const updateHeaderState = useCallback(
    (state: Partial<SharedHeaderState>) => {
      dispatch(updateHeaderStateAction(state));
    },
    [dispatch]
  );

  const handleUnmount = useCallback(() => {
    dispatch(resetHeaderState());
  }, [dispatch]);

  useComponentWillUnmount(handleUnmount);

  return {
    updateHeaderState,
  };
};
