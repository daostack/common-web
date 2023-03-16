import { Dispatch, SetStateAction, useEffect } from "react";
import { CommonService } from "@/services";
import { Common } from "@/shared/models";
import { State } from "./types";
import { updateCommonsBySubscription } from "./utils";

export const useCommonSubscription = (
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
            data: !isRemoved
              ? {
                  ...currentState.data,
                  common: updatedCommon,
                }
              : null,
          };
        });
      },
    );

    return unsubscribe;
  }, [commonId]);
};
