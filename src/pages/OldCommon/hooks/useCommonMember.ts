import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  CommonMemberEventEmitter,
  CommonMemberEvent,
  CommonMemberEventToListener,
  CommonEventEmitter,
  CommonEvent,
} from "@/events";
import { selectUser } from "@/pages/Auth/store/selectors";
import { ErrorCode } from "@/shared/constants";
import { useIsMounted } from "@/shared/hooks";
import { LoadingState } from "@/shared/interfaces";
import {
  Circles,
  CirclesPermissions,
  CommonMember,
  Governance,
} from "@/shared/models";
import {
  generateCirclesDataForCommonMember,
  isGeneralError,
} from "@/shared/utils";
import {
  cacheActions,
  selectCommonMemberStateByUserAndCommonIds,
} from "@/store/states";
import { CommonService, GovernanceService, Logger } from "../../../services";

interface Options {
  shouldAutoReset?: boolean;
  withSubscription?: boolean;
  commonId?: string;
  governanceCircles?: Circles;
  userId?: string;
}

type State = LoadingState<(CommonMember & CirclesPermissions) | null>;

interface IdentificationInfo {
  userId: string;
  commonId: string;
}

interface Return extends State {
  fetchCommonMember: (
    commonId: string,
    options?: { governance?: Governance; commonMember?: CommonMember },
    force?: boolean,
  ) => void;
  setCommonMember: (
    commonMember: (CommonMember & CirclesPermissions) | null,
  ) => void;
  resetCommonMember: () => void;
  missingCirclesError: boolean;
}

const DEFAULT_STATE: State = {
  loading: false,
  fetched: false,
  data: null,
};

export const useCommonMember = (options: Options = {}): Return => {
  const {
    shouldAutoReset = true,
    withSubscription = false,
    commonId,
    governanceCircles,
  } = options;
  const dispatch = useDispatch();
  const currentLoadingIdRef = useRef("");
  const isMounted = useIsMounted();
  const [missingCirclesError, setMissingCirclesError] = useState(false);
  const user = useSelector(selectUser());
  const userId = options.userId || user?.uid;
  const [identificationInfo, setIdentificationInfo] =
    useState<IdentificationInfo | null>(
      userId && commonId ? { userId, commonId } : null,
    );
  const identificationInfoRef = useRef<IdentificationInfo | null>(
    identificationInfo,
  );
  identificationInfoRef.current = identificationInfo;
  const commonMemberState =
    useSelector(
      selectCommonMemberStateByUserAndCommonIds(
        identificationInfo || { userId: "", commonId: "" },
      ),
    ) || DEFAULT_STATE;
  const [state, setState] = useState<State>(commonMemberState);
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
      const loadingId = uuidv4();
      currentLoadingIdRef.current = loadingId;
      setIdentificationInfo({ userId, commonId });

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

        if (
          identificationInfoRef.current?.commonId !== commonId ||
          identificationInfoRef.current?.userId !== userId ||
          currentLoadingIdRef.current !== loadingId ||
          !isMounted()
        ) {
          return;
        }

        if (governance && commonMember) {
          const finalState: State = {
            loading: false,
            fetched: true,
            data: {
              commonId,
              ...commonMember,
              ...generateCirclesDataForCommonMember(
                governance.circles,
                commonMember.circleIds,
              ),
            },
          };
          setState(finalState);
          dispatch(
            cacheActions.updateCommonMemberStateByUserAndCommonIds({
              userId,
              commonId,
              state: finalState,
            }),
          );
        } else {
          if (
            identificationInfoRef.current?.commonId !== commonId ||
            identificationInfoRef.current?.userId !== userId
          ) {
            return;
          }

          const finalState = {
            loading: false,
            fetched: true,
            data: null,
          };
          setState(finalState);
          dispatch(
            cacheActions.updateCommonMemberStateByUserAndCommonIds({
              userId,
              commonId,
              state: finalState,
            }),
          );
        }
      } catch (e) {
        if (currentLoadingIdRef.current === loadingId) {
          Logger.error({ state, e });
          setState({
            loading: false,
            fetched: true,
            data: null,
          });
        }
      }
    },
    [state, userId, commonId],
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
        (subscriptionData) => {
          try {
            let data: State["data"] = null;

            if (subscriptionData) {
              const {
                commonMember,
                statuses: { isAdded, isRemoved },
              } = subscriptionData;

              if (isAdded) {
                CommonEventEmitter.emit(CommonEvent.ProjectUpdated, {
                  commonId,
                  hasMembership: true,
                });
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
            }

            const finalState = {
              loading: false,
              fetched: true,
              data,
            };
            setState(finalState);
            dispatch(
              cacheActions.updateCommonMemberStateByUserAndCommonIds({
                userId,
                commonId,
                state: finalState,
              }),
            );
          } catch (err) {
            if (
              isGeneralError(err) &&
              (err.code === ErrorCode.CCircleInGovernanceNotFound ||
                err.code === ErrorCode.CCircleIndexValidationFailure)
            ) {
              setMissingCirclesError(true);
            }
          }
        },
      );

    return unsubscribe;
  }, [withSubscription, commonId, userId, governanceCircles]);

  return {
    ...(state.fetched ? state : commonMemberState),
    fetchCommonMember,
    setCommonMember,
    resetCommonMember,
    missingCirclesError,
  };
};
