import { Dispatch, SetStateAction, useEffect } from "react";
import { CommonService } from "@/services";
import { State } from "./types";

export const useParentCommonSubscription = (
  setState: Dispatch<SetStateAction<State>>,
  commonId?: string,
) => {
  useEffect(() => {
    if (!commonId) {
      return;
    }

    const unsubscribe = CommonService.subscribeToCommon(
      commonId,
      (updatedCommon, isRemoved) => {
        setState((currentState) => {
          if (!currentState.data) {
            return currentState;
          }

          return {
            ...currentState,
            data: {
              ...currentState.data,
              parentCommon: !isRemoved ? updatedCommon : undefined,
            },
          };
        });
      },
    );

    return unsubscribe;
  }, [commonId]);
};
