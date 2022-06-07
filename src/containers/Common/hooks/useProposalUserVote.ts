import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { LoadingState } from "@/shared/interfaces";
import { Vote } from "@/shared/models";
import { selectUser } from "@/containers/Auth/store/selectors";
import { getVote } from "../store/api";

type State = LoadingState<Vote | null>;

interface Return extends State {
  fetchProposalVote: (proposalId: string) => void;
}

export const useProposalUserVote = (): Return => {
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: null,
  });
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const fetchProposalVote = useCallback(async (proposalId: string) => {
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
        data: data
      });
    } catch (error) {
      setState({
        loading: false,
        fetched: false,
        data: null
      });
    }
  }, [state, userId])


  return {
    ...state,
    fetchProposalVote,
  };
};
