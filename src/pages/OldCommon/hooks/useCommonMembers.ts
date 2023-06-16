import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { LoadingState } from "@/shared/interfaces";
import { CommonMemberWithUserInfo } from "@/shared/models";
import { getCommonMembers } from "../store/actions";

type State = LoadingState<CommonMemberWithUserInfo[]>;

interface Return extends State {
  fetchCommonMembers: (
    commonId: string,
    circleVisibility?: string[],
    force?: boolean,
  ) => void;
  setCommonMembers: (commonMembers: CommonMemberWithUserInfo[]) => void;
  resetCommonMembers: () => void;
}

export const useCommonMembers = (): Return => {
  const dispatch = useDispatch();
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: [],
  });

  const fetchCommonMembers = useCallback(
    (commonId: string, circleVisibility: string[] = [], force = false) => {
      if (!force && (state.loading || state.fetched)) {
        return;
      }

      setState({
        loading: true,
        fetched: false,
        data: [],
      });

      dispatch(
        getCommonMembers.request({
          payload: { commonId, circleVisibility },
          callback: (error, commonMembers) => {
            const nextState: State = {
              loading: false,
              fetched: true,
              data: [],
            };

            if (!error && commonMembers) {
              nextState.data = commonMembers;
            }

            setState(nextState);
          },
        }),
      );
    },
    [state, dispatch],
  );

  const setCommonMembers = useCallback(
    (commonMembers: CommonMemberWithUserInfo[]) => {
      setState({
        loading: false,
        fetched: true,
        data: commonMembers,
      });
    },
    [],
  );

  const resetCommonMembers = useCallback(() => {
    setState({
      loading: false,
      fetched: false,
      data: [],
    });
  }, []);

  return {
    ...state,
    fetchCommonMembers,
    setCommonMembers,
    resetCommonMembers,
  };
};
