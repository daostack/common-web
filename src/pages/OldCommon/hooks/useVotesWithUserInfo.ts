import { useCallback } from "react";
import { useLoadingState } from "@/shared/hooks";
import { VoteWithUserInfo } from "@/shared/models";
import { getVotesWithUserInfo } from "../store/api";

interface Return {
  loading: boolean;
  votes: VoteWithUserInfo[];
  fetchVotes: (proposalId: string, force?: boolean) => void;
}

export const useVotesWithUserInfo = (): Return => {
  const [state, setState] = useLoadingState<VoteWithUserInfo[]>([]);

  const fetchVotes = useCallback(
    async (proposalId: string, force = false) => {
      if (!force && (state.loading || state.fetched)) {
        return;
      }

      setState({
        loading: true,
        fetched: false,
        data: [],
      });

      let votes: VoteWithUserInfo[] = [];

      try {
        votes = await getVotesWithUserInfo(proposalId);
      } catch (error) {
        votes = [];
      } finally {
        setState({
          loading: false,
          fetched: true,
          data: votes,
        });
      }
    },
    [state],
  );

  return {
    fetchVotes,
    loading: state.loading || !state.fetched,
    votes: state.data,
  };
};
