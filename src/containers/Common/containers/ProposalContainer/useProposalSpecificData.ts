import { useCallback } from "react";
import { getUserData } from "@/containers/Auth/store/api";
import { useLoadingState } from "@/shared/hooks";
import { Proposal, User } from "@/shared/models";
import {
  isAssignCircleProposal,
  isRemoveCircleProposal,
} from "@/shared/models/governance/proposals";
import { LoadingState } from "@/shared/interfaces";

export interface ProposalSpecificData {
  user: User | null;
}

interface Return extends LoadingState<ProposalSpecificData> {
  fetchData: (proposal: Proposal, force?: boolean) => void;
}

const INITIAL_DATA: ProposalSpecificData = {
  user: null,
};

export const useProposalSpecificData = (): Return => {
  const [state, setState] = useLoadingState<ProposalSpecificData>(INITIAL_DATA);

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
        setState({
          loading: false,
          fetched: true,
          data: {
            user,
          },
        });
      }
    },
    [state]
  );

  return {
    ...state,
    fetchData,
  };
};
