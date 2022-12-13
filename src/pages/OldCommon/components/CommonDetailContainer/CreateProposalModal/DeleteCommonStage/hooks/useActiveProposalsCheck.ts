import { useCallback } from "react";
import { Logger, ProposalService } from "@/services";
import { useLoadingState } from "@/shared/hooks";
import { LoadingState } from "@/shared/interfaces";

type State = LoadingState<boolean | null>;

interface Return extends State {
  checkActiveProposals: (commonId: string) => void;
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

  const checkActiveProposals = useCallback(async (commonId: string) => {
    setState({
      loading: true,
      fetched: false,
      data: null,
    });

    try {
      const activeProposalsExist =
        await ProposalService.checkActiveProposalsExistenceInCommon(commonId);

      setState({
        loading: false,
        fetched: true,
        data: activeProposalsExist,
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
