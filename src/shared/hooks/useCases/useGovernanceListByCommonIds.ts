import { useEffect, useState } from "react";
import { GovernanceService } from "@/services";
import { LoadingState } from "@/shared/interfaces";
import { Governance } from "@/shared/models";

type State = LoadingState<Governance[] | null>;

type Return = State;

export const useGovernanceListByCommonIds = (commonIds: string[]): Return => {
  const [state, setState] = useState<State>({
    loading: true,
    fetched: false,
    data: null,
  });

  useEffect(() => {
    if (commonIds.length === 0) {
      return;
    }

    const unsubscribe = GovernanceService.subscribeToGovernanceListByCommonIds(
      commonIds,
      (data) => {
        setState((currentState) => {
          if (!currentState.data || currentState.data.length === 0) {
            return {
              loading: false,
              fetched: true,
              data: data.map((item) => item.governance),
            };
          }

          const nextData = [...currentState.data];

          data.forEach((item) => {
            const itemIndex = nextData.findIndex(
              ({ id }) => id === item.governance.id,
            );

            if (itemIndex === -1) {
              nextData.push(item.governance);
              return;
            }

            if (item.statuses.isRemoved) {
              nextData.splice(itemIndex, 1);
            } else {
              nextData[itemIndex] = item.governance;
            }
          });

          return {
            loading: false,
            fetched: true,
            data: nextData,
          };
        });
      },
    );

    return unsubscribe;
  }, [commonIds]);

  return state;
};
