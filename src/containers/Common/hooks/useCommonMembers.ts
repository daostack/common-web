import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { LoadingState } from "@/shared/interfaces";
import { CommonMemberWithUserInfo } from "@/shared/models";
import { getCommonMembers } from "../store/actions";

type State = LoadingState<CommonMemberWithUserInfo[]>;

interface Return extends State {
  fetchCommonMembers: (commonId: string) => void;
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
    (commonId: string) => {
      if (state.loading || state.fetched) {
        return;
      }

      setState((nextState) => ({
        ...nextState,
        loading: true,
      }));

      dispatch(
        getCommonMembers.request({
          payload: commonId,
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
        })
      );
    },
    [state, dispatch]
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
    resetCommonMembers,
  };
};
