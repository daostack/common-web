import { useCallback } from "react";
import { fetchSupportersDataByCommonId } from "@/pages/OldCommon/store/api";
import { LoadingState } from "@/shared/interfaces";
import { SupportersData } from "@/shared/models";
import { useLoadingState } from "../useLoadingState";

type State = LoadingState<SupportersData | null>;

interface Return extends State {
  fetchSupportersData: (commonId: string) => void;
}

export const useSupportersData = (): Return => {
  const [state, setState] = useLoadingState<SupportersData | null>(null);

  const fetchSupportersData = useCallback((commonId: string) => {
    setState((nextState) => ({
      ...nextState,
      loading: true,
    }));

    (async () => {
      try {
        const supportersData = await fetchSupportersDataByCommonId(commonId);

        setState({
          loading: false,
          fetched: true,
          data: supportersData,
        });
      } catch (error) {
        setState({
          loading: false,
          fetched: true,
          data: null,
        });
      }
    })();
  }, []);

  return {
    ...state,
    fetchSupportersData,
  };
};
