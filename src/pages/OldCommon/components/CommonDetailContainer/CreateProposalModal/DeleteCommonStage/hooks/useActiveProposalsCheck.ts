import { useCallback } from "react";
import { Logger } from "@/services";
import { useLoadingState } from "@/shared/hooks";
import { LoadingState } from "@/shared/interfaces";

type State = LoadingState<boolean | null>;

interface Return extends State {
  checkActiveProposals: () => void;
}

export const useActiveProposalsCheck = (initialValue?: boolean): Return => {
  const [state, setState] = useLoadingState<boolean | null>(
    initialValue ?? null,
    typeof initialValue === "boolean"
      ? {
          loading: false,
          fetched: true,
        }
      : {},
  );

  const checkActiveProposals = useCallback(async () => {
    setState({
      loading: true,
      fetched: false,
      data: null,
    });

    try {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      setState({
        loading: false,
        fetched: true,
        data: true,
      });
    } catch (error) {
      Logger.error(error);
      setState({
        loading: false,
        fetched: true,
        data: null,
      });
    }
  }, []);

  return {
    ...state,
    checkActiveProposals,
  };
};
