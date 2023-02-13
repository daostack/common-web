import { useCallback, useState } from "react";
import { last } from "lodash";
import { CommonService, GovernanceService } from "@/services";
import { State } from "./types";
import { useCommonSubscription } from "./useCommonSubscription";
import { useGovernanceSubscription } from "./useGovernanceSubscription";
import { useParentCommonSubscription } from "./useParentCommonSubscription";
import { useSubCommonCreateSubscription } from "./useSubCommonCreateSubscription";
import { useDispatch } from "react-redux";
import { setCommonGovernance } from "@/store/states/common/actions";

interface Return extends State {
  fetchCommonData: (commonId: string) => void;
  resetCommonData: () => void;
}

export const useFullCommonData = (): Return => {
  const dispatch = useDispatch();
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: null,
  });
  const currentCommonId = state.data?.common.id;
  useSubCommonCreateSubscription(setState, currentCommonId);
  useCommonSubscription(setState, currentCommonId, state.data?.parentCommons);
  useGovernanceSubscription(setState, state.data?.governance.id);
  useParentCommonSubscription(setState, state.data?.parentCommon?.id);

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
        dispatch(setCommonGovernance(governance));

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
        dispatch(setCommonGovernance(null));
        setState({
          loading: false,
          fetched: true,
          data: null,
        });
      }
    })();
  }, [dispatch]);

  const resetCommonData = useCallback(() => {
    dispatch(setCommonGovernance(null));
    setState({
      loading: false,
      fetched: false,
      data: null,
    });
  }, [dispatch]);

  return {
    ...state,
    fetchCommonData,
    resetCommonData,
  };
};
