import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCommonState,
  updateCommonState,
} from "@/pages/OldCommon/store/actions";
import { selectCommonStateById } from "@/pages/OldCommon/store/selectors";
import { LoadingState } from "@/shared/interfaces";
import { Common } from "@/shared/models";

type State = LoadingState<Common | null>;

interface Return extends State {
  fetchCommon: (commonId: string) => void;
  setCommon: (common: Common | null) => void;
}

const DEFAULT_STATE: State = {
  loading: false,
  fetched: false,
  data: null,
};

export const useCommon = (outerCommonId?: string): Return => {
  const dispatch = useDispatch();
  const [currentCommonId, setCurrentCommonId] = useState("");
  const [defaultState, setDefaultState] = useState({ ...DEFAULT_STATE });
  const state =
    useSelector(selectCommonStateById(outerCommonId ?? currentCommonId)) ||
    defaultState;

  const fetchCommon = useCallback(
    (commonId: string) => {
      setDefaultState({ ...DEFAULT_STATE });
      setCurrentCommonId(commonId);
      dispatch(
        getCommonState.request({
          payload: { commonId },
        }),
      );
    },
    [dispatch],
  );

  const setCommon = useCallback(
    (common: Common | null) => {
      const nextState: State = {
        loading: false,
        fetched: true,
        data: common,
      };

      if (common) {
        dispatch(
          updateCommonState({
            commonId: common.id,
            state: nextState,
          }),
        );
      }

      setDefaultState(nextState);
      setCurrentCommonId(common?.id || "");
    },
    [dispatch],
  );

  useEffect(() => {
    if (typeof outerCommonId === "undefined") {
      return;
    }
    if (outerCommonId) {
      fetchCommon(outerCommonId);
    } else {
      setCommon(null);
    }
  }, [outerCommonId]);

  return {
    ...state,
    fetchCommon,
    setCommon,
  };
};
