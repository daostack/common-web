import { Dispatch, SetStateAction, useEffect } from "react";
import { CommonService } from "@/services";
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

  useEffect(() => {
    if (!commonId) {
      return;
    }

    const unsubscribe = CommonService.subscribeToSubCommons(
      commonId,
      (data) => {
        setState((currentState) => {
          if (!currentState.data) {
            return currentState;
          }

          const subCommons = updateCommonsBySubscription(
            data,
            currentState.data?.subCommons,
          );

          return {
            ...currentState,
            data: {
              ...currentState.data,
              subCommons,
            },
          };
        });
      },
    );

    return unsubscribe;
  }, [commonId]);
};
