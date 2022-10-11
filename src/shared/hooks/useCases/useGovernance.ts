import { useCallback, useState } from "react";
import { getGovernance } from "@/containers/Common/store/api";
import { LoadingState } from "@/shared/interfaces";
import { Governance } from "@/shared/models";

type State = LoadingState<Governance | null>;

interface Return extends State {
  fetchGovernance: (governanceId: string) => void;
  setGovernance: (governance: Governance | null) => void;
}

export const useGovernance = (): Return => {
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: null,
  });

  const fetchGovernance = useCallback((governanceId: string) => {
    setState((nextState) => ({
      ...nextState,
      loading: true,
    }));

    (async () => {
      try {
        const governance = await getGovernance(governanceId);

        setState({
          loading: false,
          fetched: true,
          data: governance,
        });
      } catch (error) {
        setState({
          loading: false,
          fetched: true,
          data: null,
        });
      }
    })();
  }, []);

  const setGovernance = useCallback((governance: Governance | null) => {
    setState({
      loading: false,
      fetched: true,
      data: governance,
    });
  }, []);

  return {
    ...state,
    fetchGovernance,
    setGovernance,
  };
};
