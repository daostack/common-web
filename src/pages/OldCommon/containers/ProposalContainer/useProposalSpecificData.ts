import { useCallback } from "react";
import { getUserData } from "@/pages/Auth/store/api";
import { useCommonMembers } from "@/pages/OldCommon/hooks";
import { useLoadingState } from "@/shared/hooks";
import { useSubCommons } from "@/shared/hooks/useCases";
import { LoadingState } from "@/shared/interfaces";
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

interface Options {
  commonId?: string;
}

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

export const useProposalSpecificData = ({ commonId }: Options): Return => {
  const [state, setState] = useLoadingState<ProposalSpecificData>(INITIAL_DATA);
  const {
    data: commonMembers,
    loading: areCommonMembersLoading,
    fetched: areCommonMembersFetched,
    fetchCommonMembers,
    setCommonMembers,
  } = useCommonMembers({ commonId });
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
        fetchCommonMembers();
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
    ],
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
