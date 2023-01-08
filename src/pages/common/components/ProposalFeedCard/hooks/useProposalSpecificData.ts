import { useCallback } from "react";
import { AllocateFundsTo } from "@/shared/constants";
import { useLoadingState } from "@/shared/hooks";
import { useUserById } from "@/shared/hooks/useCases";
import { LoadingState } from "@/shared/interfaces";
import { Proposal } from "@/shared/models";
import {
  FundsAllocation,
  isFundsAllocationProposal,
} from "@/shared/models/governance/proposals";
import { ProposalSpecificData } from "../types";

interface Return extends LoadingState<ProposalSpecificData> {
  fetchData: (proposal: Proposal, force?: boolean) => void;
}

const INITIAL_DATA: ProposalSpecificData = {
  targetUser: null,
};

export const useProposalSpecificData = (): Return => {
  const [state, setState] = useLoadingState<ProposalSpecificData>(INITIAL_DATA);
  const {
    fetchUser: fetchTargetUser,
    setUser: setTargetUser,
    data: targetUser,
    loading: isTargetUserLoading,
    fetched: isTargetUserFetched,
  } = useUserById();
  const isLoading = state.loading || isTargetUserLoading;
  const isFetched = state.fetched && isTargetUserFetched;

  const fetchFundsAllocationProposalData = useCallback(
    (fundsAllocation: FundsAllocation) => {
      const { to, subcommonId, otherMemberId, proposerId } =
        fundsAllocation.data.args;

      if (to === AllocateFundsTo.SubCommon) {
        if (subcommonId) {
          // TODO: fetch target common
        } else {
          // TODO: setTargetCommon to null
        }
        return;
      }

      const targetUserId = otherMemberId || proposerId;
      fetchTargetUser(targetUserId);
    },
    [fetchTargetUser],
  );

  const fetchData = useCallback(
    async (proposal: Proposal, force = false) => {
      if (!force && (state.loading || state.fetched)) {
        return;
      }

      setState({
        loading: true,
        fetched: false,
        data: INITIAL_DATA,
      });

      if (isFundsAllocationProposal(proposal)) {
        fetchFundsAllocationProposalData(proposal);
      } else {
        setTargetUser(null);
      }

      setState((nextState) => ({
        loading: false,
        fetched: true,
        data: nextState.data,
      }));
    },
    [state, fetchFundsAllocationProposalData, setTargetUser],
  );

  return {
    data: {
      ...state.data,
      targetUser,
    },
    loading: isLoading,
    fetched: isFetched,
    fetchData,
  };
};
