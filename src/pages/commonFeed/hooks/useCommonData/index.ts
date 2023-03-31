import { useCallback, useState } from "react";
import {
  CommonFeedService,
  CommonService,
  GovernanceService,
} from "@/services";
import { State, CombinedState } from "./types";
import { useCommonSubscription } from "./useCommonSubscription";
import { useGovernanceSubscription } from "./useGovernanceSubscription";

interface FetchCommonDataOptions {
  commonId: string;
  sharedFeedItemId?: string | null;
}

interface Return extends CombinedState {
  fetchCommonData: (options: FetchCommonDataOptions) => void;
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

  const fetchCommonData = useCallback((options: FetchCommonDataOptions) => {
    const { commonId, sharedFeedItemId } = options;
    setState({
      loading: true,
      fetched: false,
      data: null,
    });

    (async () => {
      try {
        const [common, governance, commonMembersAmount, sharedFeedItem] =
          await Promise.all([
            CommonService.getCommonById(commonId),
            GovernanceService.getGovernanceByCommonId(commonId),
            CommonService.getCommonMembersAmount(commonId),
            sharedFeedItemId
              ? CommonFeedService.getCommonFeedItemById(
                  commonId,
                  sharedFeedItemId,
                )
              : null,
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
            commonMembersAmount,
            sharedFeedItem,
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
