import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingState } from "@/shared/interfaces";
import { User } from "@/shared/models";
import { cacheActions, selectUserStateById } from "@/store/states";

type State = LoadingState<User | null>;

interface Return extends State {
  fetchUser: (userId: string) => void;
  setUser: (user: User | null) => void;
}

const DEFAULT_STATE: State = {
  loading: false,
  fetched: false,
  data: null,
};

export const useUserById = (): Return => {
  const dispatch = useDispatch();
  const [currentUserId, setCurrentUserId] = useState("");
  const [defaultState, setDefaultState] = useState({ ...DEFAULT_STATE });
  const state = useSelector(selectUserStateById(currentUserId)) || defaultState;

  const fetchUser = useCallback(
    (userId: string) => {
      setDefaultState({ ...DEFAULT_STATE });
      setCurrentUserId(userId);
      dispatch(
        cacheActions.getUserStateById.request({
          payload: { userId },
        }),
      );
    },
    [dispatch],
  );

  const setUser = useCallback(
    (user: User | null) => {
      const nextState: State = {
        loading: false,
        fetched: true,
        data: user,
      };

      if (user?.uid) {
        dispatch(
          cacheActions.updateUserStateById({
            userId: user.uid,
            state: nextState,
          }),
        );
      }

      setDefaultState(nextState);
      setCurrentUserId(user?.uid || "");
    },
    [dispatch],
  );

  return {
    ...state,
    fetchUser,
    setUser,
  };
};
