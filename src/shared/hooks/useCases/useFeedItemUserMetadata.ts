import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonFeedObjectUserUniqueService } from "@/services";
import { LoadingState } from "@/shared/interfaces";
import { CommonFeedObjectUserUnique } from "@/shared/models";
import { cacheActions, selectFeedItemUserMetadata } from "@/store/states";

type State = LoadingState<CommonFeedObjectUserUnique | null>;

interface IdentificationInfo {
  commonId: string;
  userId: string;
  feedObjectId: string;
}

interface Return extends State {
  fetchFeedItemUserMetadata: (info: IdentificationInfo) => void;
}

const DEFAULT_STATE: State = {
  loading: false,
  fetched: false,
  data: null,
};

export const useFeedItemUserMetadata = (): Return => {
  const dispatch = useDispatch();
  const [identificationInfo, setIdentificationInfo] =
    useState<IdentificationInfo | null>(null);
  const [defaultState, setDefaultState] = useState({ ...DEFAULT_STATE });
  const state =
    useSelector(
      selectFeedItemUserMetadata(
        identificationInfo || { commonId: "", userId: "", feedObjectId: "" },
      ),
    ) || defaultState;

  const fetchFeedItemUserMetadata = useCallback(
    (info: IdentificationInfo) => {
      setDefaultState({
        ...DEFAULT_STATE,
        fetched: !info.userId,
      });
      setIdentificationInfo(info);

      if (info.userId) {
        dispatch(
          cacheActions.getFeedItemUserMetadata.request({
            payload: info,
          }),
        );
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (!identificationInfo || !identificationInfo.userId) {
      return;
    }

    const unsubscribe =
      CommonFeedObjectUserUniqueService.subscribeToFeedItemUserMetadata(
        identificationInfo.commonId,
        identificationInfo.userId,
        identificationInfo.feedObjectId,
        (data) => {
          dispatch(
            cacheActions.updateFeedItemUserMetadata({
              ...identificationInfo,
              state: {
                loading: false,
                fetched: true,
                data,
              },
            }),
          );
        },
      );

    return unsubscribe;
  }, [identificationInfo]);

  return {
    ...state,
    fetchFeedItemUserMetadata,
  };
};
