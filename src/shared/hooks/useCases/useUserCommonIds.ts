import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { CommonService } from "@/services";
import { LoadingState } from "@/shared/interfaces";
import { useLoadingState } from "../useLoadingState";

export const useUserCommonIds = (): LoadingState<string[]> => {
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const [state, setState] = useLoadingState<string[]>([], {
    loading: false,
    fetched: !userId,
  });

  useEffect(() => {
    if (!userId) {
      setState({
        loading: false,
        fetched: true,
        data: [],
      });
      return;
    }

    setState({
      loading: true,
      fetched: false,
      data: [],
    });

    const unsubscribe = CommonService.subscribeToUserCommonIds(
      userId,
      (userCommonIds) => {
        setState({
          loading: false,
          fetched: true,
          data: userCommonIds,
        });
      },
    );

    return unsubscribe;
  }, [userId]);

  return {
    ...state,
  };
};
