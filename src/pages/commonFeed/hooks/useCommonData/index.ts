import { useCallback, useState } from "react";
import { last } from "lodash";
import {
  CommonFeedService,
  CommonService,
  GovernanceService,
} from "@/services";
import { useCommonSubscription } from "@/shared/hooks/useCases/useFullCommonData/useCommonSubscription";
import { Common, CommonMember } from "@/shared/models";
import { State, CombinedState } from "./types";
import { useGovernanceSubscription } from "./useGovernanceSubscription";

interface FetchCommonDataOptions {
  commonId: string;
  sharedFeedItemId?: string | null;
}

interface Return extends CombinedState {
  fetchCommonData: (options: FetchCommonDataOptions) => void;
  resetCommonData: () => void;
}

const getRootCommon = async (
  parentCommon?: Common | null,
  rootCommonId?: string,
): Promise<Common | null> => {
  if (parentCommon && parentCommon.id === rootCommonId) {
    return parentCommon;
  }

  return rootCommonId ? CommonService.getCommonById(rootCommonId) : null;
};

const getRootCommonMember = async (
  parentCommonMember?: CommonMember | null,
  parentCommonId?: string,
  rootCommonId?: string,
  userId?: string,
): Promise<CommonMember | null> => {
  if (parentCommonMember && parentCommonId === rootCommonId) {
    return parentCommonMember;
  }

  return rootCommonId && userId
    ? CommonService.getCommonMemberByUserId(rootCommonId, userId)
    : null;
};

export const useCommonData = (userId?: string): Return => {
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: null,
  });
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
            throw new Error(
              `Couldn't find governance by common id= ${commonId}`,
            );
          }

          const { rootCommonId } = common;
          const parentCommonId = common.directParent?.commonId;
          const [
            parentCommons,
            subCommons,
            parentCommonMember,
            rootCommonGovernance,
          ] = await Promise.all([
            CommonService.getAllParentCommonsForCommon(common),
            CommonService.getCommonsByDirectParentIds([common.id]),
            parentCommonId && userId
              ? CommonService.getCommonMemberByUserId(parentCommonId, userId)
              : null,
            rootCommonId
              ? GovernanceService.getGovernanceByCommonId(rootCommonId)
              : null,
          ]);
          const parentCommon = last(parentCommons);
          const [rootCommon, rootCommonMember] = await Promise.all([
            getRootCommon(parentCommon, rootCommonId),
            getRootCommonMember(
              parentCommonMember,
              parentCommonId,
              rootCommonId,
              userId,
            ),
          ]);

          setState({
            loading: false,
            fetched: true,
            data: {
              common,
              governance,
              parentCommons,
              subCommons,
              commonMembersAmount,
              sharedFeedItem,
              rootCommon,
              rootCommonMember,
              rootCommonGovernance,
              parentCommon,
              parentCommonMember,
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
    fetchCommonData,
    resetCommonData,
  };
};

export type { Data as CommonData } from "./types";
