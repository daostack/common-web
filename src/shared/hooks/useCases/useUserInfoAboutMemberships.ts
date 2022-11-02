import { useCallback } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { UserMembershipInfo } from "@/pages/Common/interfaces";
import { getUserInfoAboutMemberships } from "@/pages/Common/store/api";
import { useLoadingState } from "@/shared/hooks";
import { LoadingState } from "@/shared/interfaces";

type State = LoadingState<UserMembershipInfo[]>;

interface Return extends State {
  fetchUserInfoAboutMemberships: () => void;
}

export const useUserInfoAboutMemberships = (isLoading?: boolean): Return => {
  const [state, setState] = useLoadingState<UserMembershipInfo[]>([], {
    loading: isLoading,
  });
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const fetchUserInfoAboutMemberships = useCallback(() => {
    if (!userId) {
      return;
    }

    setState((nextState) => ({
      ...nextState,
      loading: true,
    }));

    (async () => {
      try {
        const data = await getUserInfoAboutMemberships(userId);

        setState({
          loading: false,
          fetched: true,
          data: data,
        });
      } catch (error) {
        setState({
          loading: false,
          fetched: true,
          data: [],
        });
      }
    })();
  }, [userId]);

  return {
    ...state,
    fetchUserInfoAboutMemberships,
  };
};
