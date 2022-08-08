import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";
import { LoadingState } from "@/shared/interfaces";
import { Common } from "@/shared/models";
import { getUserCommons } from "../store/actions";

type State = LoadingState<Common[]>;

interface Return extends State {
  fetchUserCommons: () => void;
}

export const useUserCommons = (): Return => {
  const dispatch = useDispatch();
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: [],
  });
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const fetchUserCommons = useCallback(() => {
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
      getUserCommons.request({
        payload: userId,
        callback: (error, commons) => {
          const nextState: State = {
            loading: false,
            fetched: true,
            data: [],
          };

          if (!error && commons) {
            nextState.data = commons;
          }

          setState(nextState);
        },
      })
    );
  }, [state, dispatch, userId]);

  return {
    ...state,
    fetchUserCommons,
  };
};
