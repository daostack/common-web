import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";
import { LoadingState } from "@/shared/interfaces";
import { verifyIsUserMemberOfAnyCommon } from "../store/api";

type State = LoadingState<boolean>;

interface Return extends State {
  checkMembershipInAnyCommon: () => void;
  resetMembershipCheck: () => void;
}

export const useMemberInAnyCommon = (): Return => {
  const dispatch = useDispatch();
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: false,
  });
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const checkMembershipInAnyCommon = useCallback(() => {
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

    (async () => {
      try {
        const isMemberOfAnyCommon = await verifyIsUserMemberOfAnyCommon(userId);

        setState({
          loading: false,
          fetched: true,
          data: isMemberOfAnyCommon,
        });
      } catch (error) {
        setState({
          loading: false,
          fetched: true,
          data: false,
        });
      }
    })();
  }, [dispatch, userId]);

  const resetMembershipCheck = useCallback(() => {
    setState({
      loading: false,
      fetched: false,
      data: false,
    });
  }, []);

  return {
    ...state,
    checkMembershipInAnyCommon,
    resetMembershipCheck,
  };
};
