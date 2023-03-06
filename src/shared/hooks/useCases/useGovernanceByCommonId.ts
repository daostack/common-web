import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GovernanceService } from "@/services";
import { LoadingState } from "@/shared/interfaces";
import { Governance } from "@/shared/models";
import { cacheActions, selectGovernanceStateByCommonId } from "@/store/states";

type State = LoadingState<Governance | null>;

interface Return extends State {
  fetchGovernance: (commonId: string) => void;
  setGovernance: (governance: Governance | null) => void;
}

const DEFAULT_STATE: State = {
  loading: false,
  fetched: false,
  data: null,
};

export const useGovernanceByCommonId = (): Return => {
  const dispatch = useDispatch();
  const [currentCommonId, setCurrentCommonId] = useState("");
  const [defaultState, setDefaultState] = useState({ ...DEFAULT_STATE });
  const state =
    useSelector(selectGovernanceStateByCommonId(currentCommonId)) ||
    defaultState;
  const governanceId = state.data?.id || "";

  const fetchGovernance = useCallback(
    (commonId: string) => {
      setDefaultState({ ...DEFAULT_STATE });
      setCurrentCommonId(commonId);
      dispatch(
        cacheActions.getGovernanceStateByCommonId.request({
          payload: { commonId },
        }),
      );
    },
    [dispatch],
  );

  const setGovernance = useCallback(
    (governance: Governance | null) => {
      const nextState: State = {
        loading: false,
        fetched: true,
        data: governance,
      };

      if (governance) {
        dispatch(
          cacheActions.updateGovernanceStateByCommonId({
            commonId: governance.commonId,
            state: nextState,
          }),
        );
      }

      setDefaultState(nextState);
      setCurrentCommonId(governance?.id || "");
    },
    [dispatch],
  );

  useEffect(() => {
    if (!governanceId) {
      return;
    }

    const unsubscribe = GovernanceService.subscribeToGovernance(
      governanceId,
      (updatedGovernance) => {
        dispatch(
          cacheActions.updateGovernanceStateByCommonId({
            commonId: updatedGovernance.commonId,
            state: {
              loading: false,
              fetched: true,
              data: updatedGovernance,
            },
          }),
        );
      },
    );

    return unsubscribe;
  }, [governanceId]);

  return {
    ...state,
    fetchGovernance,
    setGovernance,
  };
};
