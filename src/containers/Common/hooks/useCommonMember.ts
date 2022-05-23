import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";
import { LoadingState } from "@/shared/interfaces";
import { CommonMember } from "@/shared/models";
import { getCommonMember } from "../store/actions";

type State = LoadingState<CommonMember | null>;

interface Return extends State {
  fetchCommonMember: (commonId: string) => void;
}

export const useCommonMember = (): Return => {
  const dispatch = useDispatch();
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: null,
  });
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const fetchCommonMember = useCallback(
    (commonId: string) => {
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

      dispatch(
        getCommonMember.request({
          payload: {
            commonId,
            userId,
          },
          callback: (error, commonMember) => {
            const nextState: State = {
              loading: false,
              fetched: true,
              data: null,
            };

            if (!error && commonMember) {
              nextState.data = commonMember;
            }

            setState(nextState);
          },
        })
      );
    },
    [state, dispatch, userId]
  );

  return {
    ...state,
    fetchCommonMember,
  };
};
