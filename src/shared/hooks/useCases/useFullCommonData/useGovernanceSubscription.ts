import { Dispatch, SetStateAction, useEffect } from "react";
import { GovernanceService } from "@/services";
import { State } from "./types";

export const useGovernanceSubscription = (
  setState: Dispatch<SetStateAction<State>>,
  governanceId?: string,
) => {
  useEffect(() => {
    if (!governanceId) {
      return;
    }

    const unsubscribe = GovernanceService.subscribeToGovernance(
      governanceId,
      (updatedGovernance, isRemoved) => {
        setState((currentState) => {
          if (!currentState.data) {
            return currentState;
          }

          return {
            ...currentState,
            data: !isRemoved
              ? {
                  ...currentState.data,
                  governance: updatedGovernance,
                }
              : null,
          };
        });
      },
    );

    return unsubscribe;
  }, [governanceId]);
};
