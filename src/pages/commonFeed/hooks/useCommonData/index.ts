import { useCallback, useState } from "react";
import { CommonService, GovernanceService } from "@/services";
import { State, CombinedState } from "./types";
import { useCommonSubscription } from "./useCommonSubscription";
import { useGovernanceSubscription } from "./useGovernanceSubscription";

interface Return extends CombinedState {
  fetchCommonData: (commonId: string) => void;
  resetCommonData: () => void;
}

export const useCommonData = (): Return => {
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: null,
  });
  const isLoading = state.loading;
  const isFetched = state.fetched;
  const currentCommonId = state.data?.common.id;
  useCommonSubscription(setState, currentCommonId);
  useGovernanceSubscription(setState, state.data?.governance.id);

  const fetchCommonData = useCallback((commonId: string) => {
    setState({
      loading: true,
      fetched: false,
      data: null,
    });

    (async () => {
      try {
        const [common, governance] = await Promise.all([
          CommonService.getCommonById(commonId),
          GovernanceService.getGovernanceByCommonId(commonId),
        ]);

        if (!common) {
          throw new Error(`Couldn't find common by id = ${commonId}`);
        }
        if (!governance) {
          throw new Error(`Couldn't find governance by common id= ${commonId}`);
        }

        setState({
          loading: false,
          fetched: true,
          data: {
            common,
            governance,
          },
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

  const resetCommonData = useCallback(() => {
    setState({
      loading: false,
      fetched: false,
      data: null,
    });
  }, []);

  return {
    loading: isLoading,
    fetched: isFetched,
    data: state.data,
    fetchCommonData,
    resetCommonData,
  };
};
