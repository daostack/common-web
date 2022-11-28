import { useCallback, useState } from "react";
import { CommonService, GovernanceService } from "@/services";
import { LoadingState } from "@/shared/interfaces";
import { Common, Governance } from "@/shared/models";

interface Data {
  common: Common;
  governance: Governance;
}

type State = LoadingState<Data | null>;

interface Return extends State {
  fetchCommonData: (commonId: string) => void;
  resetCommonData: () => void;
}

export const useFullCommonData = (): Return => {
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: null,
  });

  const fetchCommonData = useCallback((commonId: string) => {
    setState((nextState) => ({
      ...nextState,
      loading: true,
    }));

    (async () => {
      try {
        const [common, governance] = await Promise.all([
          CommonService.getCommonById(commonId),
          GovernanceService.getGovernanceByCommonId(commonId),
        ]);

        if (!common) {
          throw new Error(`Couldn't find common by id = ${commonId}`);
        }
        if (!governance) {
          throw new Error(`Couldn't find governance by common id= ${commonId}`);
        }

        setState({
          loading: false,
          fetched: true,
          data: {
            common,
            governance,
          },
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

  const resetCommonData = useCallback(() => {
    setState({
      loading: false,
      fetched: false,
      data: null,
    });
  }, []);

  return {
    ...state,
    fetchCommonData,
    resetCommonData,
  };
};
