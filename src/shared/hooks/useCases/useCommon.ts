import { useCallback, useState } from "react";
import { fetchCommonDetail } from "@/containers/Common/store/api";
import { LoadingState } from "@/shared/interfaces";
import { Common } from "@/shared/models";

type State = LoadingState<Common | null>;

interface Return extends State {
  fetchCommon: (commonId: string) => void;
}

export const useCommon = (): Return => {
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: null,
  });

  const fetchCommon = useCallback((commonId: string) => {
    setState((nextState) => ({
      ...nextState,
      loading: true,
    }));

    (async () => {
      try {
        const common = await fetchCommonDetail(commonId);

        setState({
          loading: false,
          fetched: true,
          data: common,
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

  return {
    ...state,
    fetchCommon,
  };
};
