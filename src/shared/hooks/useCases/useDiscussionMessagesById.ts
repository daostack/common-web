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
  addDiscussionMessage: (
    discussionId: string,
    discussionMessage: DiscussionMessage,
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
  const [isLoading, setIsLoading] = useState(false);
  const state =
    useSelector(
      selectDiscussionMessagesStateByDiscussionId(currentDiscussionId),
    ) || defaultState;
  const [discussionMessagesWithOwners, setDiscussionMessagesWithOwners] =
    useState<any>();

  const addDiscussionMessage = (
    discussionId: string,
    discussionMessage: DiscussionMessage,
  ): void => {
    dispatch(
      cacheActions.addDiscussionMessageByDiscussionId({
        discussionId,
        discussionMessage,
      }),
    );
  };

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
      setIsLoading(true);
      const discussionMessages = [...(state.data || [])];
      const filteredMessages = discussionMessages.filter(
        ({ moderation }) =>
          moderation?.flag !== ModerationFlags.Hidden || hasPermissionToHide,
      );
      const ownerIds = Array.from(
        new Set(
          filteredMessages?.flatMap((d) => {
            if (d.ownerType === "user") {
              return [d.ownerId];
            }
            return [];
          }),
        ),
      ) as string[];
      const owners = await fetchMessageOwners(ownerIds);

      const loadedDiscussionMessages = filteredMessages.map((d) => {
        const newDiscussionMessage = { ...d };
        const parentMessage = filteredMessages.find(
          ({ id }) => id === d.parentId,
        );
        if (
          d.ownerType === "user" &&
          newDiscussionMessage.ownerType === "user"
        ) {
          newDiscussionMessage.owner = owners.find((o) => o.uid === d.ownerId);
        }
        newDiscussionMessage.parentMessage = parentMessage
          ? {
              id: parentMessage.id,
              text: parentMessage.text,
              ownerName: parentMessage?.ownerName,
              ...(parentMessage.ownerType === "user" && {
                ownerId: parentMessage.ownerId,
              }),
              moderation: parentMessage?.moderation,
              images: parentMessage?.images,
            }
          : null;
        return newDiscussionMessage;
      });

      setDiscussionMessagesWithOwners(loadedDiscussionMessages);
      setIsLoading(false);
    })();
  }, [state.data, messageOwnersIds, messageOwners, hasPermissionToHide]);

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
    loading: state.loading || isLoading,
    data: discussionMessagesWithOwners,
    fetchDiscussionMessages,
    addDiscussionMessage,
  };
};
