import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingState } from "@/shared/interfaces";
import { CommonMemberWithUserInfo } from "@/shared/models";
import {
  cacheActions,
  selectCommonMembersStateByCommonId,
} from "@/store/states";
import { getCommonMembers } from "../store/actions";

interface Options {
  commonId?: string
}

type State = LoadingState<CommonMemberWithUserInfo[]>;

interface Return extends State {
  fetchCommonMembers: (
    circleVisibility?: string[]
  ) => void;
  setCommonMembers: (commonMembers: CommonMemberWithUserInfo[]) => void;
}

const DEFAULT_STATE: State = {
  loading: false,
  fetched: false,
  data: [],
};

export const useCommonMembers = ({ commonId }: Options): Return => {
  const dispatch = useDispatch();

  const state =
    useSelector(selectCommonMembersStateByCommonId(commonId)) ||
    DEFAULT_STATE;

  const fetchCommonMembers = useCallback(
    (circleVisibility: string[] = []) => {
      if (!commonId) {
        return;
      }

      dispatch(
        getCommonMembers.request({
          payload: { commonId, circleVisibility },
          callback: (error, commonMembers) => {
            if (!error) {
              dispatch(
                cacheActions.updateCommonMembersByCommonId({
                  commonId,
                  commonMembers: commonMembers ?? [],
                }),
              );
            }
          },
        }),
      );
    },
    [state, dispatch, commonId],
  );

  const setCommonMembers = useCallback(
    (commonMembers: CommonMemberWithUserInfo[]) => {
      dispatch(
        cacheActions.updateCommonMembersByCommonId({
          commonId,
          commonMembers: commonMembers ?? [],
        }),
      );
    },
    [commonId],
  );

  return {
    data: state.data ?? [],
    loading: false,
    fetched: true,
    fetchCommonMembers,
    setCommonMembers,
  };
};
