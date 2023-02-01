import { useCallback } from "react";
import { ProposalService } from "@/services";
import { EligibleVoters } from "@/shared/models";
import { useIsMounted } from "../useIsMounted";
import { useLoadingState } from "../useLoadingState";

interface Return {
  loading: boolean;
  voters: EligibleVoters[];
  fetchEligibleVoters: (proposalId: string, force?: boolean) => void;
}

export const useEligibleVoters = (): Return => {
  const isMounted = useIsMounted();
  const [state, setState] = useLoadingState([]);

  const fetchEligibleVoters = useCallback(
    async (proposalId: string, force = false) => {
      if (!force && (state.loading || state.fetched)) {
        return;
      }

      setState({
        loading: true,
        fetched: false,
        data: [],
      });

      let voters: EligibleVoters[] = [];

      try {
        voters = await ProposalService.proposalEligibleVoters(proposalId);
      } catch (error) {
        voters = [];
      } finally {
        if (isMounted()) {
          setState({
            loading: false,
            fetched: true,
            data: voters as any, // TODO: need to check the type error
          });
        }
      }
    },
    [state],
  );

  return {
    fetchEligibleVoters,
    loading: state.loading || !state.fetched,
    voters: state.data,
  };
};
