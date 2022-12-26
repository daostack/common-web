import { Dispatch, SetStateAction, useEffect } from "react";
import { CommonService } from "@/services";
import { Common } from "@/shared/models";
import { State } from "./types";
import { updateCommonsBySubscription } from "./utils";

export const useCommonSubscription = (
  setState: Dispatch<SetStateAction<State>>,
  commonId?: string,
  parentCommons: Common[] = [],
) => {
  const parentCommonIds = parentCommons.map((common) => common.id);
  const parentCommonsDepsKey = parentCommonIds.join(",");

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

  useEffect(() => {
    if (parentCommonIds.length === 0) {
      return;
    }

    const unsubscribe = CommonService.subscribeToCommons(
      parentCommonIds,
      (data) => {
        setState((currentState) => {
          if (!currentState.data) {
            return currentState;
          }

          const parentCommons = updateCommonsBySubscription(
            data,
            currentState.data?.parentCommons,
          );

          return {
            ...currentState,
            data: {
              ...currentState.data,
              parentCommons,
            },
          };
        });
      },
    );

    return unsubscribe;
  }, [parentCommonsDepsKey]);
};
