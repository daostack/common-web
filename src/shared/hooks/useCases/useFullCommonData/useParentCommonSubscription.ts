import { Dispatch, SetStateAction, useEffect } from "react";
import { CommonService } from "@/services";
import { State } from "./types";
import { updateCommonsBySubscription } from "./utils";

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

          const parentCommonSubCommons = updateCommonsBySubscription(
            data,
            currentState.data?.parentCommonSubCommons,
          );

          return {
            ...currentState,
            data: {
              ...currentState.data,
              parentCommonSubCommons,
            },
          };
        });
      },
    );

    return unsubscribe;
  }, [commonId]);
};
