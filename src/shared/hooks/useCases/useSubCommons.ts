import { useCallback, useState } from "react";
import { fetchSubCommonsByCommonId } from "@/pages/OldCommon/store/api";
import { LoadingState } from "@/shared/interfaces";
import { Common } from "@/shared/models";

type State = LoadingState<Common[]>;

interface Return extends State {
  fetchSubCommons: (commonId: string) => void;
  setSubCommons: (commons: Common[]) => void;
  addSubCommon: (common: Common) => void;
}

export const useSubCommons = (): Return => {
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: [],
  });

  const fetchSubCommons = useCallback((commonId: string) => {
    setState((nextState) => ({
      ...nextState,
      loading: true,
    }));

    (async () => {
      try {
        const commons = await fetchSubCommonsByCommonId(commonId);

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

  const setSubCommons = useCallback((commons: Common[]) => {
    setState({
      loading: false,
      fetched: true,
      data: commons,
    });
  }, []);

  const addSubCommon = useCallback((common: Common) => {
    setState((nextState) => ({
      ...nextState,
      data: nextState.data.concat(common),
    }));
  }, []);

  return {
    ...state,
    fetchSubCommons,
    setSubCommons,
    addSubCommon,
  };
};
