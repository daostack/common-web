import { useCallback, useState } from "react";
import { fetchCommonListByIds } from "@/containers/Common/store/api";
import { LoadingState } from "@/shared/interfaces";
import { Common } from "@/shared/models";

type State = LoadingState<Common[]>;

interface Return extends State {
  fetchCommons: (commonIds: string[]) => void;
}

export const useCommons = (): Return => {
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: [],
  });

  const fetchCommons = useCallback((commonIds: string[]) => {
    setState((nextState) => ({
      ...nextState,
      loading: true,
    }));

    (async () => {
      try {
        const commons = await fetchCommonListByIds(commonIds);

        setState({
          loading: false,
          fetched: true,
          data: commons,
        });
      } catch (error) {
        setState({
          loading: false,
          fetched: true,
          data: [],
        });
      }
    })();
  }, []);

  return {
    ...state,
    fetchCommons,
  };
};
