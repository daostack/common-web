import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProposalService } from "@/services";
import { LoadingState } from "@/shared/interfaces";
import { Proposal } from "@/shared/models";
import { cacheActions, selectProposalStateById } from "@/store/states";

type State = LoadingState<Proposal | null>;

interface Return extends State {
  fetchProposal: (proposalId: string) => void;
  setProposal: (proposal: Proposal | null) => void;
}

const DEFAULT_STATE: State = {
  loading: false,
  fetched: false,
  data: null,
};

export const useProposalById = (): Return => {
  const dispatch = useDispatch();
  const [currentProposalId, setCurrentProposalId] = useState("");
  const [defaultState, setDefaultState] = useState({ ...DEFAULT_STATE });
  const state =
    useSelector(selectProposalStateById(currentProposalId)) || defaultState;

  const fetchProposal = useCallback(
    (proposalId: string) => {
      setDefaultState({ ...DEFAULT_STATE });
      setCurrentProposalId(proposalId);
    },
    [dispatch],
  );

  const setProposal = useCallback(
    (proposal: Proposal | null) => {
      const nextState: State = {
        loading: false,
        fetched: true,
        data: proposal,
      };

      if (proposal) {
        dispatch(
          cacheActions.updateProposalStateById({
            proposalId: proposal.id,
            state: nextState,
          }),
        );
      }

      setDefaultState(nextState);
      setCurrentProposalId(proposal?.id || "");
    },
    [dispatch],
  );

  useEffect(() => {
    if (!currentProposalId) {
      return;
    }

    const unsubscribe = ProposalService.subscribeToProposal(
      currentProposalId,
      (updatedProposal) => {
        dispatch(
          cacheActions.updateProposalStateById({
            proposalId: updatedProposal.id,
            state: {
              loading: false,
              fetched: true,
              data: updatedProposal,
            },
          }),
        );
      },
    );

    return unsubscribe;
  }, [currentProposalId]);

  return {
    ...state,
    fetchProposal,
    setProposal,
  };
};
