import { useCallback, useEffect, useState } from "react";
import { last } from "lodash";
import {
  CommonEvent,
  CommonEventEmitter,
  CommonEventToListener,
} from "@/events";
import { CommonService, GovernanceService } from "@/services";
import { LoadingState } from "@/shared/interfaces";
import { Common, Governance } from "@/shared/models";

interface Data {
  common: Common;
  governance: Governance;
  parentCommons: Common[];
  subCommons: Common[];
  parentCommon?: Common;
  parentCommonSubCommons: Common[];
}

type State = LoadingState<Data | null>;

interface Return extends State {
  fetchCommonData: (commonId: string) => void;
  resetCommonData: () => void;
}

export const useFullCommonData = (): Return => {
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: null,
  });
  const currentCommonId = state.data?.common.id;

  const fetchCommonData = useCallback((commonId: string) => {
    setState({
      loading: true,
      fetched: false,
      data: null,
    });

    (async () => {
      try {
        const [common, governance] = await Promise.all([
          CommonService.getCommonById(commonId),
          GovernanceService.getGovernanceByCommonId(commonId),
        ]);

        if (!common) {
          throw new Error(`Couldn't find common by id = ${commonId}`);
        }
        if (!governance) {
          throw new Error(`Couldn't find governance by common id= ${commonId}`);
        }

        const [parentCommons, subCommons, parentCommonSubCommons] =
          await Promise.all([
            CommonService.getAllParentCommonsForCommon(common),
            CommonService.getCommonsByDirectParentIds([common.id]),
            common.directParent
              ? CommonService.getCommonsByDirectParentIds([
                  common.directParent.commonId,
                ])
              : [],
          ]);

        setState({
          loading: false,
          fetched: true,
          data: {
            common,
            governance,
            parentCommons,
            subCommons,
            parentCommon: last(parentCommons),
            parentCommonSubCommons,
          },
        });
      } catch (error) {
        setState({
          loading: false,
          fetched: true,
          data: null,
        });
      }
    })();
  }, []);

  const resetCommonData = useCallback(() => {
    setState({
      loading: false,
      fetched: false,
      data: null,
    });
  }, []);

  useEffect(() => {
    if (!currentCommonId) {
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
      if (createdCommon.directParent?.commonId === currentCommonId) {
        handleSubCommonCreate(createdCommon);
      }
    };

    CommonEventEmitter.on(CommonEvent.Created, handleCommonCreate);

    return () => {
      CommonEventEmitter.off(CommonEvent.Created, handleCommonCreate);
    };
  }, [currentCommonId]);

  useEffect(() => {
    if (!currentCommonId) {
      return;
    }

    const unsubscribe = CommonService.subscribeToCommon(
      currentCommonId,
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
  }, [currentCommonId]);

  return {
    ...state,
    fetchCommonData,
    resetCommonData,
  };
};
