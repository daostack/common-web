import { Dispatch, SetStateAction, useEffect } from "react";
import { CommonService } from "@/services";
import { LoadingState } from "@/shared/interfaces";
import { Common } from "@/shared/models";
import { Data } from "./types";
import { updateCommonsBySubscription } from "./utils";

type BaseData = Pick<Data, "common" | "parentCommons" | "subCommons">;

export const useCommonSubscription = <T extends BaseData>(
  setState: Dispatch<SetStateAction<LoadingState<T | null>>>,
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
