import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEqual, xor } from "lodash";
import { fetchOwners } from "@/pages/OldCommon/store/api";
import { DiscussionMessageService } from "@/services";
import { LoadingState } from "@/shared/interfaces";
import { ModerationFlags } from "@/shared/interfaces/Moderation";
import { DiscussionMessage, User } from "@/shared/models";
import {
  cacheActions,
  selectDiscussionMessagesStateByDiscussionId,
} from "@/store/states";

interface Options {
  hasPermissionToHide: boolean;
}

type State = LoadingState<DiscussionMessage[] | null>;

interface Return extends State {
  fetchDiscussionMessages: (discussionId: string) => void;
  setDiscussionMessages: (
    discussionMessages: DiscussionMessage[] | null,
  ) => void;
}

const DEFAULT_STATE: State = {
  loading: false,
  fetched: false,
  data: null,
};

export const useDiscussionMessagesById = ({
  hasPermissionToHide,
}: Options): Return => {
  const dispatch = useDispatch();
  const [currentDiscussionId, setCurrentDiscussionId] = useState("");
  const [defaultState, setDefaultState] = useState({ ...DEFAULT_STATE });
  const [messageOwners, setMessageOwners] = useState<User[]>([]);
  const [messageOwnersIds, setMessageOwnersIds] = useState<string[]>([]);
  const state =
    useSelector(
      selectDiscussionMessagesStateByDiscussionId(currentDiscussionId),
    ) || defaultState;
  const [discussionMessagesWithOwners, setDiscussionMessagesWithOwners] =
    useState<any>();

  const fetchDiscussionMessages = useCallback(
    (discussionId: string) => {
      setDefaultState({ ...DEFAULT_STATE });
      setCurrentDiscussionId(discussionId);
      dispatch(
        cacheActions.getDiscussionMessageStateByDiscussionId.request({
          payload: { discussionId },
        }),
      );
    },
    [dispatch],
  );

  const fetchMessageOwners = async (ids: string[]): Promise<User[]> => {
    if (isEqual(messageOwnersIds, ids)) {
      return [...messageOwners];
    }
    const newOwnerIds = xor(messageOwnersIds, ids);
    const owners = (await fetchOwners(newOwnerIds)) as User[];
    setMessageOwnersIds(ids);
    setMessageOwners([...messageOwners, ...owners]);
    return owners;
  };

  useEffect(() => {
    (async () => {
      const discussionMessages = [...(state.data || [])];
      const filteredMessages = discussionMessages.filter(
        ({ moderation }) =>
          moderation?.flag !== ModerationFlags.Hidden || hasPermissionToHide,
      );
      const ownerIds = Array.from(
        new Set(filteredMessages?.map((d) => d.ownerId)),
      ) as string[];
      const owners = await fetchMessageOwners(ownerIds);

      const loadedDiscussionMessages = filteredMessages.map((d) => {
        const newDiscussionMessage = { ...d };
        const parentMessage = filteredMessages.find(
          ({ id }) => id === d.parentId,
        );
        newDiscussionMessage.owner = owners.find((o) => o.uid === d.ownerId);
        newDiscussionMessage.parentMessage = parentMessage
          ? {
              id: parentMessage.id,
              text: parentMessage.text,
              ownerName: parentMessage?.ownerName,
              moderation: parentMessage?.moderation,
            }
          : null;
        return newDiscussionMessage;
      });

      setDiscussionMessagesWithOwners(loadedDiscussionMessages);
    })();
  }, [state.data, messageOwnersIds, messageOwners, hasPermissionToHide]);

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
    data: discussionMessagesWithOwners,
    fetchDiscussionMessages,
    setDiscussionMessages,
  };
};
