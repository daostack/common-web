import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { LoadingState } from "@/shared/interfaces";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import { CommonService, GovernanceService } from "../../../services";
import { generateCirclesDataForCommonMember } from "../../../shared/utils/generateCircleDataForCommonMember";

type State = LoadingState<(CommonMember & CirclesPermissions) | null>;

interface Return extends State {
  fetchCommonMember: (
    commonId: string,
    options: { governance?: Governance; commonMember?: CommonMember },
    force?: boolean,
  ) => void;
  resetCommonMember: () => void;
}

export const useCommonMember = (shouldAutoReset = true): Return => {
  const dispatch = useDispatch();
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: null,
  });
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const fetchCommonMember = useCallback(
    async (
      commonId: string,
      options: { governance?: Governance; commonMember?: CommonMember } = {},
      force = false,
    ) => {
      if (!force && (state.loading || state.fetched)) {
        return;
      }
      if (!userId || !commonId) {
        setState({
          loading: false,
          fetched: true,
          data: null,
        });
        return;
      }

      setState({
        loading: true,
        fetched: false,
        data: null,
      });

      try {
        const [governance, commonMember] = await Promise.all([
          options.governance ||
            GovernanceService.getGovernanceByCommonId(commonId),
          options.commonMember ||
            CommonService.getCommonMemberByUserId(commonId, userId),
        ]);

        if (!governance || !commonMember) {
          setState({
            loading: false,
            fetched: false,
            data: null,
          });
          return;
        }

        const nextState: State = {
          loading: false,
          fetched: true,
          data: null,
        };

        nextState.data = {
          ...commonMember,
          ...generateCirclesDataForCommonMember(
            governance.circles,
            commonMember.circleIds,
          ),
        };

        setState(nextState);
      } catch (e) {
        setState({
          loading: false,
          fetched: false,
          data: null,
        });
      }
    },
    [state, dispatch, userId],
  );

  const resetCommonMember = useCallback(() => {
    setState({
      loading: false,
      fetched: false,
      data: null,
    });
  }, []);

  useEffect(() => {
    if (shouldAutoReset) {
      resetCommonMember();
    }
  }, [userId]);

  return {
    ...state,
    fetchCommonMember,
    resetCommonMember,
  };
};
