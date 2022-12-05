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
        const governance =
          options.governance ||
          (await GovernanceService.getGovernanceByCommonId(commonId));
        const commonMember =
          options.commonMember ||
          (await CommonService.getCommonMemberByUserId(commonId, userId));

        if (governance && commonMember) {
          setState({
            loading: false,
            fetched: true,
            data: {
              ...commonMember,
              ...generateCirclesDataForCommonMember(
                governance.circles,
                commonMember.circleIds,
              ),
            },
          });
        }
      } catch (e) {
        console.log(state, e);

        setState({
          loading: false,
          fetched: true,
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
