import { RefObject, useCallback, useRef, useState } from "react";
import { last } from "lodash";
import {
  CommonFeedService,
  CommonService,
  GovernanceService,
} from "@/services";
import { getRootCommon } from "@/shared/hooks/useCases/useFullCommonData";
import { useCommonSubscription } from "@/shared/hooks/useCases/useFullCommonData/useCommonSubscription";
import { State, CombinedState } from "./types";
import { useGovernanceSubscription } from "./useGovernanceSubscription";

interface FetchCommonDataOptions {
  commonId: string;
  sharedFeedItemId?: string | null;
}

interface Return extends CombinedState {
  stateRef: RefObject<State>;
  fetchCommonData: (options: FetchCommonDataOptions) => void;
  resetCommonData: () => void;
}

export const useCommonData = (userId?: string): Return => {
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: null,
  });
  const stateRef = useRef<State>(state);
  stateRef.current = state;
  const isLoading = state.loading;
  const isFetched = state.fetched;
  const currentCommonId = state.data?.common.id;
  useCommonSubscription(setState, currentCommonId, state.data?.parentCommons);
  useGovernanceSubscription(setState, state.data?.governance.id);

  const fetchCommonData = useCallback(
    (options: FetchCommonDataOptions) => {
      const { commonId, sharedFeedItemId } = options;
      setState({
        loading: true,
        fetched: false,
        data: null,
      });

      (async () => {
        try {
          const [common, governance, sharedFeedItem] = await Promise.all([
            CommonService.getCommonById(commonId),
            GovernanceService.getGovernanceByCommonId(commonId),
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
            throw new Error(
              `Couldn't find governance by common id= ${commonId}`,
            );
          }

          const { rootCommonId } = common;
          const [parentCommons, subCommons, rootCommonGovernance] =
            await Promise.all([
              CommonService.getAllParentCommonsForCommon(common),
              CommonService.getCommonsByDirectParentIds([common.id]),
              rootCommonId
                ? GovernanceService.getGovernanceByCommonId(rootCommonId)
                : null,
            ]);
          const rootCommon = await getRootCommon(
            rootCommonId,
            parentCommons[0],
          );

          setState({
            loading: false,
            fetched: true,
            data: {
              common,
              governance,
              parentCommons,
              subCommons,
              sharedFeedItem,
              rootCommon,
              rootCommonGovernance,
              parentCommon: last(parentCommons),
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
    },
    [userId],
  );

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
    stateRef,
    fetchCommonData,
    resetCommonData,
  };
};

export type { Data as CommonData } from "./types";
