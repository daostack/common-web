import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CommonMemberEventEmitter,
  CommonMemberEvent,
  CommonMemberEventToListener,
} from "@/events";
import { selectUser } from "@/pages/Auth/store/selectors";
import { LoadingState } from "@/shared/interfaces";
import {
  Circles,
  CirclesPermissions,
  CommonMember,
  Governance,
} from "@/shared/models";
import { generateCirclesDataForCommonMember } from "@/shared/utils";
import { commonLayoutActions, projectsActions } from "@/store/states";
import { CommonService, GovernanceService, Logger } from "../../../services";

interface Options {
  shouldAutoReset?: boolean;
  withSubscription?: boolean;
  commonId?: string;
  governanceCircles?: Circles;
}

type State = LoadingState<(CommonMember & CirclesPermissions) | null>;

interface Return extends State {
  fetchCommonMember: (
    commonId: string,
    options: { governance?: Governance; commonMember?: CommonMember },
    force?: boolean,
  ) => void;
  setCommonMember: (
    commonMember: (CommonMember & CirclesPermissions) | null,
  ) => void;
  resetCommonMember: () => void;
}

export const useCommonMember = (options: Options = {}): Return => {
  const {
    shouldAutoReset = true,
    withSubscription = false,
    commonId,
    governanceCircles,
  } = options;
  const dispatch = useDispatch();
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: null,
  });
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const commonMemberId = state.data?.id;

  const fetchCommonMember = useCallback(
    async (
      commonId: string,
      options: { governance?: Governance; commonMember?: CommonMember } = {},
      force = false,
    ) => {
      if (!force && (state.loading || state.fetched)) {
        return;
      }
      if (!userId) {
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
            (await GovernanceService.getGovernanceByCommonId(commonId)),
          options.commonMember ||
            (await CommonService.getCommonMemberByUserId(commonId, userId)),
        ]);

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
        } else {
          setState({
            loading: false,
            fetched: true,
            data: null,
          });
        }
      } catch (e) {
        Logger.error({ state, e });

        setState({
          loading: false,
          fetched: true,
          data: null,
        });
      }
    },
    [state, userId],
  );

  const setCommonMember = useCallback(
    (newCommonMember: (CommonMember & CirclesPermissions) | null) => {
      setState({
        loading: false,
        fetched: true,
        data: newCommonMember,
      });
    },
    [],
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

  useEffect(() => {
    if (!commonMemberId) {
      return;
    }

    const clearCommonMember: CommonMemberEventToListener[CommonMemberEvent.Clear] =
      (commonMemberIdToClear: string) => {
        if (commonMemberIdToClear === commonMemberId) {
          setState({
            loading: false,
            fetched: true,
            data: null,
          });
        }
      };

    const resetCommonMember: CommonMemberEventToListener[CommonMemberEvent.Reset] =
      (commonId: string, commonMemberIdToReset: string) => {
        if (commonMemberIdToReset !== commonMemberId) {
          return;
        }

        fetchCommonMember(commonId, {}, true);
      };

    CommonMemberEventEmitter.on(CommonMemberEvent.Clear, clearCommonMember);
    CommonMemberEventEmitter.on(CommonMemberEvent.Reset, resetCommonMember);

    return () => {
      CommonMemberEventEmitter.off(CommonMemberEvent.Clear, clearCommonMember);
      CommonMemberEventEmitter.off(CommonMemberEvent.Reset, resetCommonMember);
    };
  }, [commonMemberId, fetchCommonMember]);

  useEffect(() => {
    if (!withSubscription || !commonId || !userId || !governanceCircles) {
      return;
    }

    const unsubscribe =
      CommonService.subscribeToCommonMemberByCommonIdAndUserId(
        commonId,
        userId,
        (commonMember, { isAdded, isRemoved }) => {
          let data: State["data"] = null;

          if (isAdded) {
            const data = {
              commonId,
              hasMembership: true,
            };

            dispatch(commonLayoutActions.updateCommonOrProject(data));
            dispatch(projectsActions.updateProject(data));
          }
          if (!isRemoved) {
            data = {
              ...commonMember,
              ...generateCirclesDataForCommonMember(
                governanceCircles,
                commonMember.circleIds,
              ),
            };
          }

          setState({
            loading: false,
            fetched: true,
            data,
          });
        },
      );

    return unsubscribe;
  }, [withSubscription, commonId, userId, governanceCircles]);

  return {
    ...state,
    fetchCommonMember,
    setCommonMember,
    resetCommonMember,
  };
};
