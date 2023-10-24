import { useEffect, useState } from "react";
import { CommonService } from "@/services";
import { LoadingState } from "@/shared/interfaces";
import { Common } from "@/shared/models";

type State = LoadingState<Common[] | null>;

type Return = State;

export const useCommonsByDirectParentId = (parentCommonId?: string): Return => {
  const [state, setState] = useState<State>({
    loading: true,
    fetched: false,
    data: null,
  });

  useEffect(() => {
    if (!parentCommonId) {
      return;
    }

    const unsubscribe = CommonService.subscribeToCommonsByDirectParentId(
      parentCommonId,
      (data) => {
        setState((currentState) => {
          if (!currentState.data || currentState.data.length === 0) {
            return {
              loading: false,
              fetched: true,
              data: data.map((item) => item.common),
            };
          }

          const nextData = [...currentState.data];

          data.forEach((item) => {
            const itemIndex = nextData.findIndex(
              ({ id }) => id === item.common.id,
            );

            if (itemIndex === -1) {
              nextData.push(item.common);
              return;
            }

            if (item.statuses.isRemoved) {
              nextData.splice(itemIndex, 1);
            } else {
              nextData[itemIndex] = item.common;
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

    return () => {
      unsubscribe();
      setState({
        loading: true,
        fetched: false,
        data: null,
      });
    };
  }, [parentCommonId]);

  return state;
};
