import { useCallback, useState } from "react";
import { getGovernance } from "@/pages/OldCommon/store/api";
import { setCommonGovernance } from "@/store/states/common/actions";
import { LoadingState } from "@/shared/interfaces";
import { Governance } from "@/shared/models";
import { useDispatch } from "react-redux";

type State = LoadingState<Governance | null>;

interface Return extends State {
  fetchGovernance: (governanceId: string) => void;
  setGovernance: (governance: Governance | null) => void;
}

export const useGovernance = (): Return => {
  const dispatch = useDispatch();
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: null,
  });

  const fetchGovernance = useCallback((governanceId: string) => {
    setState({
      loading: true,
      fetched: false,
      data: null,
    });

    (async () => {
      try {
        const governance = await getGovernance(governanceId);

        dispatch(setCommonGovernance(governance));
        setState({
          loading: false,
          fetched: true,
          data: governance,
        });
      } catch (error) {
        dispatch(setCommonGovernance(null));
        setState({
          loading: false,
          fetched: true,
          data: null,
        });
      }
    })();
  }, [dispatch]);

  const setGovernance = useCallback((governance: Governance | null) => {
    dispatch(setCommonGovernance(governance));
    setState({
      loading: false,
      fetched: true,
      data: governance,
    });
  }, [dispatch]);

  return {
    ...state,
    fetchGovernance,
    setGovernance,
  };
};
