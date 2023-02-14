import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { LoadingState } from "@/shared/interfaces";
import { Logger, ProposalService } from "../../../services";

type State = LoadingState<boolean>;

interface ParentCommonInfo {
  parentCommonId?: string;
  parentCircleId?: string;
}

interface Return extends State {
  checkUserPendingJoin: (
    commonId: string,
    { parentCommonId, parentCircleId }: ParentCommonInfo,
  ) => void;
  setIsJoinPending: (isJoinPending: boolean) => void;
  resetUserPendingJoin: () => void;
}

export const useUserPendingJoin = (): Return => {
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: false,
  });
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const checkUserPendingJoin = useCallback(
    async (
      commonId: string,
      { parentCircleId, parentCommonId }: ParentCommonInfo,
    ) => {
      if (!userId) {
        setState({
          loading: false,
          fetched: true,
          data: false,
        });
        return;
      }

      setState({
        loading: true,
        fetched: false,
        data: false,
      });

      try {
        const isMemberAdmittancePending =
          await ProposalService.checkHasUserPendingMemberAdmittanceProposal(
            commonId,
            userId,
          );

        const isAssignProjectCirclePending =
          parentCommonId && parentCircleId
            ? await ProposalService.checkHasUserAssignProjectCircleProposal(
                parentCommonId,
                parentCircleId,
                userId,
              )
            : false;

        setState({
          loading: false,
          fetched: true,
          data: isMemberAdmittancePending || isAssignProjectCirclePending,
        });
      } catch (error) {
        Logger.error(error);
        setState({
          loading: false,
          fetched: true,
          data: false,
        });
      }
    },
    [userId],
  );

  const setIsJoinPending = useCallback((isJoinPending: boolean) => {
    setState((prevState) => {
      if (
        !prevState.loading &&
        prevState.fetched &&
        prevState.data === isJoinPending
      ) {
        return prevState;
      }

      return {
        loading: false,
        fetched: true,
        data: isJoinPending,
      };
    });
  }, []);

  const resetUserPendingJoin = useCallback(() => {
    setState({
      loading: false,
      fetched: false,
      data: false,
    });
  }, []);

  return {
    ...state,
    checkUserPendingJoin,
    setIsJoinPending,
    resetUserPendingJoin,
  };
};
