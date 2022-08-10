import { useCallback } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";
import { fetchUserMemberAdmittanceProposal as fetchUserMemberAdmittanceProposalApi } from "@/containers/Common/store/api";
import { useLoadingState } from "@/shared/hooks";
import { LoadingState } from "@/shared/interfaces";
import { MemberAdmittance } from "@/shared/models/governance/proposals";

type State = LoadingState<MemberAdmittance | null>;

interface Return extends State {
  fetchUserMemberAdmittanceProposal: (commonId: string) => void;
}

export const useUserMemberAdmittanceProposal = (): Return => {
  const [state, setState] = useLoadingState<MemberAdmittance | null>(null);
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const fetchUserMemberAdmittanceProposal = useCallback(
    async (commonId: string) => {
      if (state.loading || state.fetched) {
        return;
      }
      if (!userId) {
        setState((nextState) => ({
          ...nextState,
          fetched: true,
        }));
        return;
      }

      setState((nextState) => ({
        ...nextState,
        loading: true,
      }));

      let memberAdmittance: MemberAdmittance | null = null;

      try {
        memberAdmittance = await fetchUserMemberAdmittanceProposalApi(
          commonId,
          userId
        );
      } catch (error) {
        memberAdmittance = null;
      } finally {
        setState({
          loading: false,
          fetched: true,
          data: memberAdmittance,
        });
      }
    },
    [state, userId]
  );

  return {
    ...state,
    fetchUserMemberAdmittanceProposal,
  };
};
