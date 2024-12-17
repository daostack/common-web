import { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { trace } from "firebase/performance";
import { CommonService, Logger, UserService } from "@/services";
import { store } from "@/shared/appConfig";
import { LoadingState } from "@/shared/interfaces";
import { CommonMember, CommonMemberWithUserInfo, User } from "@/shared/models";
import {
  cacheActions,
  selectCommonMembersStateByCommonId,
  selectUserStates,
} from "@/store/states";
import { useDeepCompareEffect } from "react-use";
import { perf } from "@/shared/utils/firebase";

interface Options {
  commonId?: string;
}

type State = LoadingState<CommonMemberWithUserInfo[]>;

interface Return extends State {
  fetchCommonMembers: (circleVisibility?: string[]) => void;
  setCommonMembers: (commonMembers: CommonMember[]) => void;
}

const DEFAULT_STATE: State = {
  loading: false,
  fetched: false,
  data: [],
};

export const useCommonMembers = ({ commonId }: Options): Return => {
  const dispatch = useDispatch();
  const commonMembersState =
    useSelector(selectCommonMembersStateByCommonId(commonId)) || DEFAULT_STATE;
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: [],
  });
  const stateRef = useRef(state);
  stateRef.current = state;

  const fetchCommonMembers = useCallback(
    async (circleVisibility: string[] = []) => {
      if (!commonId) {
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 0));

      if (stateRef.current.data.length === 0) {
        setState({
          loading: true,
          fetched: false,
          data: [],
        });
      }

      try {
        const commonMembers = await CommonService.getCommonMembers(
          commonId,
          circleVisibility,
        );
        dispatch(
          cacheActions.updateCommonMembersByCommonId({
            commonId,
            commonMembers,
          }),
        );
      } catch (err) {
        Logger.error(err);

        if (stateRef.current.data.length === 0) {
          setState({
            loading: false,
            fetched: true,
            data: [],
          });
        }
      }
    },
    [dispatch, commonId, stateRef],
  );

  const setCommonMembers = useCallback(
    (commonMembers: CommonMember[] = []) => {
      dispatch(
        cacheActions.updateCommonMembersByCommonId({
          commonId,
          commonMembers,
        }),
      );
    },
    [dispatch, commonId],
  );

  useDeepCompareEffect(() => {
    const commonMembers = commonMembersState.data;

    if (!commonMembers) {
      return;
    }
    if (commonMembers.length === 0) {
      setState({
        loading: false,
        fetched: true,
        data: [],
      });
      return;
    }

    (async () => {
      try {
        const useCommonMembersTrace = trace(perf, 'useCommonMembers');
        useCommonMembersTrace.start();

        const cachedUserStates = selectUserStates(store.getState());
        const hasUsersFromCache = commonMembers.some(
          ({ userId }) => cachedUserStates[userId]?.data,
        );
        let userIdsToFetch = commonMembers.reduce<string[]>(
          (acc, { userId }) =>
            cachedUserStates[userId]?.data ? acc : [...acc, userId],
          [],
        );

        if (hasUsersFromCache) {
          setState((prevState) => {
            const finalCommonMembers = commonMembers.reduce<
              CommonMemberWithUserInfo[]
            >((acc, commonMember) => {
              const existingCommonMember = prevState.data.find(
                ({ id }) => id === commonMember.id,
              );

              if (existingCommonMember) {
                return [...acc, existingCommonMember];
              }

              const user = cachedUserStates[commonMember.userId]?.data;

              return user ? [...acc, { ...commonMember, user, commonId }] : acc;
            }, []);

            return {
              loading: false,
              fetched: true,
              data: finalCommonMembers,
            };
          });
        } else {
          userIdsToFetch = commonMembers.map(({ userId }) => userId);
        }

        if (userIdsToFetch.length === 0) {
          return;
        }

        const fetchedUsers = (
          await UserService.getUsersByIds(userIdsToFetch)
        ).filter((user): user is User => Boolean(user));

        setState((prevState) => {
          const finalCommonMembers = commonMembers.reduce<
            CommonMemberWithUserInfo[]
          >((acc, commonMember) => {
            const existingCommonMember = prevState.data.find(
              ({ id }) => id === commonMember.id,
            );

            if (existingCommonMember) {
              return [...acc, existingCommonMember];
            }

            const user = fetchedUsers.find(
              ({ uid }) => uid === commonMember.userId,
            );

            return user ? [...acc, { ...commonMember, user, commonId }] : acc;
          }, []);

          return {
            loading: false,
            fetched: true,
            data: finalCommonMembers,
          };
        });
        dispatch(cacheActions.updateUserStates(fetchedUsers));
        useCommonMembersTrace.stop();
      } catch (err) {
        Logger.error(err);
        setState((prevState) => ({
          loading: false,
          fetched: true,
          data: prevState.data,
        }));
      }
    })();
  }, [commonMembersState.data, commonId]);

  return {
    ...state,
    data: state.data || DEFAULT_STATE.data,
    fetchCommonMembers,
    setCommonMembers,
  };
};
