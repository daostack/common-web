import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { LoadingState } from "@/shared/interfaces";
import { getCommonMembersAmount } from "../store/actions";

type State = LoadingState<number>;

interface Return extends State {
  fetchCommonMembersAmount: (commonId: string) => void;
}

export const useCommonMembersAmount = (): Return => {
  const dispatch = useDispatch();
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: 0,
  });

  const fetchCommonMembersAmount = useCallback(
    (commonId: string) => {
      if (state.loading || state.fetched) {
        return;
      }

      setState((nextState) => ({
        ...nextState,
        loading: true,
      }));

      dispatch(
        getCommonMembersAmount.request({
          payload: commonId,
          callback: (error, commonMembersAmount) => {
            const nextState: State = {
              loading: false,
              fetched: true,
              data: 0,
            };

            if (!error) {
              nextState.data = commonMembersAmount || 0;
            }

            setState(nextState);
          },
        })
      );
    },
    [state, dispatch]
  );

  return {
    ...state,
    fetchCommonMembersAmount,
  };
};
