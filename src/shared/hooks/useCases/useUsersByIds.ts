import { useCallback, useState } from "react";
import { UserService } from "@/services";
import { LoadingState } from "@/shared/interfaces";
import { User } from "@/shared/models";

type State = LoadingState<User[] | null>;

interface Return extends State {
  fetchUsers: (uids: string[]) => void;
}

const DEFAULT_STATE: State = {
  loading: false,
  fetched: false,
  data: null,
};

export const useUsersByIds = (): Return => {
  const [state, setState] = useState({ ...DEFAULT_STATE });

  const fetchUsers = useCallback(async (uids: string[]) => {
    setState((nextState) => ({
      ...nextState,
      loading: true,
    }));

    const users = await UserService.getCachedUsersById(uids);

    setState({
      loading: false,
      fetched: true,
      data: users,
    });
  }, []);

  return {
    ...state,
    fetchUsers,
  };
};
