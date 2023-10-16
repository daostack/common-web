import { useCallback, useState } from "react";
import { last } from "lodash";
import { CommonService, GovernanceService } from "@/services";
import { useSupportersData } from "@/shared/hooks/useCases";
import { Common } from "@/shared/models";
import { State, CombinedState } from "./types";
import { useCommonSubscription } from "./useCommonSubscription";
import { useGovernanceSubscription } from "./useGovernanceSubscription";
import { useParentCommonSubscription } from "./useParentCommonSubscription";
import { useSubCommonCreateSubscription } from "./useSubCommonCreateSubscription";
import { getSeparatedState } from "./utils";

interface Return extends CombinedState {
  fetchCommonData: (commonId: string) => void;
  resetCommonData: () => void;
}

export const getRootCommon = async (
  rootCommonId?: string,
  initialRootCommon?: Common | null,
): Promise<Common | null> => {
  if (!rootCommonId) {
    return null;
  }
  if (initialRootCommon && initialRootCommon.id === rootCommonId) {
    return initialRootCommon;
  }

  return CommonService.getCommonById(rootCommonId);
};

export const useFullCommonData = (): Return => {
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: null,
  });
  const { fetchSupportersData, ...supportersState } = useSupportersData();
  const separatedState = getSeparatedState({ supportersState });
  const isLoading = state.loading || separatedState.loading;
  const isFetched = state.fetched && separatedState.fetched;
  const currentCommonId = state.data?.common.id;
  useSubCommonCreateSubscription(setState, currentCommonId);
  useCommonSubscription(setState, currentCommonId, state.data?.parentCommons);
  useGovernanceSubscription(setState, state.data?.governance.id);
  useParentCommonSubscription(setState, state.data?.parentCommon?.id);

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

        fetchSupportersData(commonId);
        const [parentCommons, subCommons, parentCommonSubCommons] =
          await Promise.all([
            CommonService.getAllParentCommonsForCommon(common),
            CommonService.getCommonsByDirectParentIds([common.id]),
            common.directParent
              ? CommonService.getCommonsByDirectParentIds([
                  common.directParent.commonId,
                ])
              : [],
          ]);
        const rootCommon = await getRootCommon(
          common.rootCommonId,
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
            rootCommon,
            parentCommon: last(parentCommons),
            parentCommonSubCommons,
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
    data:
      state.data && separatedState.data
        ? {
            ...state.data,
            ...separatedState.data,
          }
        : null,
    fetchCommonData,
    resetCommonData,
  };
};
