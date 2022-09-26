import { useCallback } from "react";
import { getUserData } from "@/containers/Auth/store/api";
import { useLoadingState } from "@/shared/hooks";
import { useSubCommons } from "@/shared/hooks/useCases";
import { Common, Proposal, User } from "@/shared/models";
import {
  isAssignCircleProposal,
  isFundsAllocationProposal,
  isRemoveCircleProposal,
} from "@/shared/models/governance/proposals";
import { LoadingState } from "@/shared/interfaces";

export interface ProposalSpecificData {
  user: User | null;
  subCommons: Common[];
}

interface Return extends LoadingState<ProposalSpecificData> {
  fetchData: (proposal: Proposal, force?: boolean) => void;
}

const INITIAL_DATA: ProposalSpecificData = {
  user: null,
  subCommons: [],
};

export const useProposalSpecificData = (): Return => {
  const [state, setState] = useLoadingState<ProposalSpecificData>(INITIAL_DATA);
  const {
    data: subCommons,
    loading: areSubCommonsLoading,
    fetched: areSubCommonsFetched,
    fetchSubCommons,
    setSubCommons,
  } = useSubCommons();
  const isLoading = state.loading || areSubCommonsLoading;
  const isFetched = state.fetched || areSubCommonsFetched;

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
        fetchSubCommons(proposal.data.args.commonId);
      } else {
        setSubCommons([]);
      }

      let user: User | null = null;

      try {
        [user] = await Promise.all([
          isAssignCircleProposal(proposal) || isRemoveCircleProposal(proposal)
            ? getUserData(proposal.data.args.userId)
            : null,
        ]);
      } catch (error) {
        user = null;
      } finally {
        setState((nextState) => ({
          loading: false,
          fetched: true,
          data: {
            ...nextState.data,
            user,
          },
        }));
      }
    },
    [state, fetchSubCommons, setSubCommons]
  );

  return {
    data: {
      ...state.data,
      subCommons,
    },
    loading: isLoading,
    fetched: isFetched,
    fetchData,
  };
};
