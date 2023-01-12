import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DiscussionMessageService } from "@/services";
import { LoadingState } from "@/shared/interfaces";
import { DiscussionMessage } from "@/shared/models";
import { cacheActions, selectDiscussionMessagesStateByDiscussionId } from "@/store/states";

type State = LoadingState<DiscussionMessage[] | null>;

interface Return extends State {
  fetchDiscussionMessages: (discussionId: string) => void;
  setDiscussionMessages: (discussionMessages: DiscussionMessage[] | null) => void;
}

const DEFAULT_STATE: State = {
  loading: false,
  fetched: false,
  data: null,
};

export const useDiscussionMessagesById = (): Return => {
  const dispatch = useDispatch();
  const [currentDiscussionId, setCurrentDiscussionId] = useState("");
  const [defaultState, setDefaultState] = useState({ ...DEFAULT_STATE });
  const state =
    useSelector(selectDiscussionMessagesStateByDiscussionId(currentDiscussionId)) || defaultState;

  const fetchDiscussionMessages = useCallback(
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

  const setDiscussionMessages = useCallback(
    (discussionMessages: DiscussionMessage[] | null) => {
      const nextState: State = {
        loading: false,
        fetched: true,
        data: discussionMessages,
      };

      if (currentDiscussionId) {
        dispatch(
          cacheActions.updateDiscussionMessagesStateByDiscussionId({
            discussionId: currentDiscussionId,
            state: nextState,
          }),
        );
      }

      setDefaultState(nextState);
    },
    [dispatch, currentDiscussionId],
  );

  useEffect(() => {
    if (!currentDiscussionId) {
      return;
    }

    const unsubscribe = DiscussionMessageService.subscribeToDiscussionMessages(
      currentDiscussionId,
      (updatedDiscussionMessages) => {
        dispatch(
          cacheActions.updateDiscussionMessagesStateByDiscussionId({
            discussionId: currentDiscussionId,
            state: {
              loading: false,
              fetched: true,
              data: updatedDiscussionMessages,
            },
          }),
        );
      },
    );

    return unsubscribe;
  }, [currentDiscussionId]);

  return {
    ...state,
    fetchDiscussionMessages,
    setDiscussionMessages,
  };
};
