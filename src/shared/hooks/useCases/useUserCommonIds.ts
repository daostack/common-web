import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { CommonService, Logger } from "@/services";
import { LoadingState } from "@/shared/interfaces";
import { useIsMounted } from "../useIsMounted";
import { useLoadingState } from "../useLoadingState";

export const useUserCommonIds = (): LoadingState<string[]> => {
  const isMounted = useIsMounted();
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const [state, setState] = useLoadingState<string[]>([], {
    loading: false,
    fetched: !userId,
  });

  const fetchUserCommonIds = useCallback(async () => {
    if (!userId) {
      return;
    }

    setState({
      loading: true,
      fetched: false,
      data: [],
    });

    let userCommonIds: string[] = [];

    try {
      userCommonIds = await CommonService.getUserCommonIds(userId);
    } catch (error) {
      Logger.error(error);
    } finally {
      if (isMounted()) {
        setState({
          loading: false,
          fetched: true,
          data: userCommonIds,
        });
      }
    }
  }, [userId]);

  const setUserCommonIds = useCallback((ids: string[]) => {
    setState({
      loading: false,
      fetched: true,
      data: ids,
    });
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserCommonIds();
    } else {
      setUserCommonIds([]);
    }
  }, [userId]);

  return {
    ...state,
  };
};
