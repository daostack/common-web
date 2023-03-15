import { useCallback, useState } from "react";
import { ProposalService } from "@/services";
import { EligibleVoterWithUserInfo } from "@/shared/models";
import { useIsMounted } from "../useIsMounted";
import { useLoadingState } from "../useLoadingState";

interface Return {
  loading: boolean;
  voters: EligibleVoterWithUserInfo[];
  fetchEligibleVoters: (proposalId: string, force?: boolean) => void;
  error?: boolean;
}

export const useEligibleVoters = (): Return => {
  const isMounted = useIsMounted();
  const [state, setState] = useLoadingState<EligibleVoterWithUserInfo[]>([]);
  const [error, setError] = useState<boolean>(false);

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

      let voters: EligibleVoterWithUserInfo[] = [];

      try {
        voters = await ProposalService.getProposalEligibleVoters(proposalId);
      } catch (error) {
        setError(true);
      } finally {
        if (isMounted()) {
          setState({
            loading: false,
            fetched: true,
            data: voters,
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
    error: error,
  };
};
