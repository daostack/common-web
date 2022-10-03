import { useCallback } from "react";
import { getUserData } from "@/containers/Auth/store/api";
import { useCommonMembers } from "@/containers/Common/hooks";
import { useLoadingState } from "@/shared/hooks";
import { useSubCommons } from "@/shared/hooks/useCases";
import {
  Common,
  CommonMemberWithUserInfo,
  Proposal,
  User,
} from "@/shared/models";
import {
  isAssignCircleProposal,
  isFundsAllocationProposal,
  isRemoveCircleProposal,
} from "@/shared/models/governance/proposals";
import { LoadingState } from "@/shared/interfaces";

export interface ProposalSpecificData {
  user: User | null;
  commonMembers: CommonMemberWithUserInfo[];
  subCommons: Common[];
}

interface Return extends LoadingState<ProposalSpecificData> {
  fetchData: (proposal: Proposal, force?: boolean) => void;
}

const INITIAL_DATA: ProposalSpecificData = {
  user: null,
  commonMembers: [],
  subCommons: [],
};

export const useProposalSpecificData = (): Return => {
  const [state, setState] = useLoadingState<ProposalSpecificData>(INITIAL_DATA);
  const {
    data: commonMembers,
    loading: areCommonMembersLoading,
    fetched: areCommonMembersFetched,
    fetchCommonMembers,
    setCommonMembers,
  } = useCommonMembers();
  const {
    data: subCommons,
    loading: areSubCommonsLoading,
    fetched: areSubCommonsFetched,
    fetchSubCommons,
    setSubCommons,
  } = useSubCommons();
  const isLoading =
    state.loading || areSubCommonsLoading || areCommonMembersLoading;
  const isFetched =
    state.fetched && areSubCommonsFetched && areCommonMembersFetched;

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

      const commonId = proposal.data.args.commonId;

      if (isFundsAllocationProposal(proposal)) {
        fetchCommonMembers(commonId);
        fetchSubCommons(commonId);
      } else {
        setCommonMembers([]);
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
    [
      state,
      fetchCommonMembers,
      setCommonMembers,
      fetchSubCommons,
      setSubCommons,
    ]
  );

  return {
    data: {
      ...state.data,
      commonMembers,
      subCommons,
    },
    loading: isLoading,
    fetched: isFetched,
    fetchData,
  };
};
