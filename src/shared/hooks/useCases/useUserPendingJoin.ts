import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { LoadingState } from "@/shared/interfaces";
import { Logger, ProposalService } from "../../../services";

type State = LoadingState<boolean>;

interface Return extends State {
  checkUserPendingJoin: (commonId: string) => void;
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
    async (commonId: string) => {
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
        const isJoinPending =
          await ProposalService.checkHasUserPendingMemberAdmittanceProposal(
            commonId,
            userId,
          );

        setState({
          loading: false,
          fetched: true,
          data: isJoinPending,
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
    resetUserPendingJoin,
  };
};
