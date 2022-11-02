import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { LoadingState } from "@/shared/interfaces";
import { Vote } from "@/shared/models";
import { getVote } from "../store/api";

type State = LoadingState<Vote | null>;

interface Return extends State {
  fetchProposalVote: (proposalId: string) => void;
  setVote: (vote: Vote) => void;
  resetProposalVote: () => void;
}

export const useProposalUserVote = (): Return => {
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: null,
  });
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const fetchProposalVote = useCallback(
    async (proposalId: string) => {
      if (state.loading || state.fetched || !userId) {
        return;
      }

      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));

      try {
        const data = await getVote(proposalId, userId);
        setState({
          loading: false,
          fetched: true,
          data: data,
        });
      } catch (error) {
        setState({
          loading: false,
          fetched: false,
          data: null,
        });
      }
    },
    [state, userId],
  );

  const setVote = useCallback((vote: Vote) => {
    setState({
      loading: false,
      fetched: true,
      data: vote,
    });
  }, []);

  const resetProposalVote = useCallback(() => {
    setState({
      loading: false,
      fetched: false,
      data: null,
    });
  }, []);

  useEffect(() => {
    resetProposalVote();
  }, [resetProposalVote, userId]);

  return {
    ...state,
    fetchProposalVote,
    setVote,
    resetProposalVote,
  };
};
