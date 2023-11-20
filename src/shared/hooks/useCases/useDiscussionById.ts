import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DiscussionService } from "@/services";
import { LoadingState } from "@/shared/interfaces";
import { Discussion } from "@/shared/models";
import { cacheActions, selectDiscussionStateById } from "@/store/states";

type State = LoadingState<Discussion | null>;

interface Return extends State {
  fetchDiscussion: (discussionId: string) => void;
  setDiscussion: (discussion: Discussion | null) => void;
}

const DEFAULT_STATE: State = {
  loading: false,
  fetched: false,
  data: null,
};

export const useDiscussionById = (): Return => {
  const dispatch = useDispatch();
  const [currentDiscussionId, setCurrentDiscussionId] = useState("");
  const [defaultState, setDefaultState] = useState({ ...DEFAULT_STATE });
  const state =
    useSelector(selectDiscussionStateById(currentDiscussionId)) || defaultState;

  const fetchDiscussion = useCallback(
    (discussionId: string) => {
      setDefaultState({ ...DEFAULT_STATE });
      setCurrentDiscussionId(discussionId);
      dispatch(
        cacheActions.getDiscussionStateById.request({
          payload: { discussionId },
        }),
      );
    },
    [dispatch],
  );

  const setDiscussion = useCallback(
    (discussion: Discussion | null) => {
      const nextState: State = {
        loading: false,
        fetched: true,
        data: discussion,
      };

      if (discussion) {
        dispatch(
          cacheActions.updateDiscussionStateById({
            discussionId: discussion.id,
            state: nextState,
          }),
        );
      }

      setDefaultState(nextState);
      setCurrentDiscussionId(discussion?.id || "");
    },
    [dispatch],
  );

  useEffect(() => {
    if (!currentDiscussionId) {
      return;
    }

    const unsubscribe = DiscussionService.subscribeToDiscussion(
      currentDiscussionId,
      (updatedDiscussion) => {
        dispatch(
          cacheActions.updateDiscussionStateById({
            discussionId: updatedDiscussion.id,
            state: {
              loading: false,
              fetched: true,
              data: updatedDiscussion,
            },
          }),
        );
      },
    );

    return unsubscribe;
  }, [currentDiscussionId]);

  return {
    ...state,
    fetchDiscussion,
    setDiscussion,
  };
};
