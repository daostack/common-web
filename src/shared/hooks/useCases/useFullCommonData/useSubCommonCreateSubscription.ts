import { Dispatch, SetStateAction, useEffect } from "react";
import {
  CommonEvent,
  CommonEventEmitter,
  CommonEventToListener,
} from "@/events";
import { Common } from "@/shared/models";
import { State } from "./types";

export const useSubCommonCreateSubscription = (
  setState: Dispatch<SetStateAction<State>>,
  commonId?: string,
) => {
  useEffect(() => {
    if (!commonId) {
      return;
    }

    const handleSubCommonCreate = (subCommon: Common) => {
      setState((currentState) => {
        if (!currentState || !currentState.data) {
          return currentState;
        }

        return {
          ...currentState,
          data: {
            ...currentState.data,
            subCommons: currentState.data?.subCommons.concat(subCommon) || [],
          },
        };
      });
    };

    const handleCommonCreate: CommonEventToListener[CommonEvent.Created] = (
      createdCommon,
    ) => {
      if (createdCommon.directParent?.commonId === commonId) {
        handleSubCommonCreate(createdCommon);
      }
    };

    CommonEventEmitter.on(CommonEvent.Created, handleCommonCreate);

    return () => {
      CommonEventEmitter.off(CommonEvent.Created, handleCommonCreate);
    };
  }, [commonId]);
};
