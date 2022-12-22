import { Dispatch, SetStateAction, useEffect } from "react";
import { CommonService } from "@/services";
import { Data, State } from "./types";

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

          const parentCommonSubCommons = data.reduce<
            Data["parentCommonSubCommons"]
          >((finalSubCommons, { common, isRemoved }) => {
            if (isRemoved) {
              return finalSubCommons.filter(
                (subCommon) => subCommon.id !== common.id,
              );
            }

            const isExistingSubCommon = finalSubCommons.some(
              (subCommon) => subCommon.id === common.id,
            );

            return isExistingSubCommon
              ? finalSubCommons.map((subCommon) =>
                  subCommon.id === common.id ? common : subCommon,
                )
              : finalSubCommons.concat(common);
          }, currentState.data?.parentCommonSubCommons || []);

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
