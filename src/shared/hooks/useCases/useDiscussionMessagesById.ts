import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateEffect } from "react-use";
import { DiscussionMessageService } from "@/services";
import { getTextFromTextEditorString } from "@/shared/components/Chat/ChatMessage/utils";
import { useRoutesContext } from "@/shared/contexts";
import { LoadingState } from "@/shared/interfaces";
import { ModerationFlags } from "@/shared/interfaces/Moderation";
import {
  checkIsSystemDiscussionMessage,
  checkIsUserDiscussionMessage,
  DirectParent,
  DiscussionMessage,
  DiscussionMessageWithParsedText,
  User,
} from "@/shared/models";
import firebase from "@/shared/utils/firebase";
import {
  cacheActions,
  selectDiscussionMessagesStateByDiscussionId,
} from "@/store/states";

export type TextStyles = {
  mentionTextCurrentUser: string;
  singleEmojiText: string;
  multipleEmojiText: string;
};

interface Options {
  hasPermissionToHide: boolean;
  userId?: string;
  discussionId: string;
  directParent?: DirectParent | null;
  onUserClick?: (userId: string) => void;
  onFeedItemClick?: (feedItemId: string) => void;
  users: User[];
  textStyles: TextStyles;
}

type State = LoadingState<DiscussionMessageWithParsedText[] | null>;

interface Return extends State {
  fetchDiscussionMessages: () => void;
  fetchRepliedMessages: (messageId: string, endDate: Date) => Promise<void>;
  addDiscussionMessage: (discussionMessage: DiscussionMessage) => void;
  deleteDiscussionMessage: (discussionMessageId: string) => void;
  isEndOfList: Record<string, boolean> | null;
  rawData: DiscussionMessage[] | null;
}

const DEFAULT_STATE: State = {
  loading: false,
  fetched: false,
  data: null,
};

export const useDiscussionMessagesById = ({
  hasPermissionToHide,
  userId,
  discussionId,
  directParent,
  onUserClick,
  onFeedItemClick,
  users,
}: Options): Return => {
  const dispatch = useDispatch();
  const { getCommonPagePath, getCommonPageAboutTabPath } = useRoutesContext();
  const [defaultState, setDefaultState] = useState({ ...DEFAULT_STATE });
  const [lastVisible, setLastVisible] = useState<
    Record<string, firebase.firestore.QueryDocumentSnapshot<DiscussionMessage>>
  >({});
  const [isEndOfList, setIsEndOfList] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const state =
    useSelector(selectDiscussionMessagesStateByDiscussionId(discussionId)) ||
    defaultState;
  const [discussionMessagesWithOwners, setDiscussionMessagesWithOwners] =
    useState<any>();

  useUpdateEffect(() => {
    if (discussionId) {
      setDiscussionMessagesWithOwners([]);
    }
  }, [discussionId]);

  const addDiscussionMessage = async (
    discussionMessage: DiscussionMessage,
  ): Promise<void> => {
    const parsedText = await getTextFromTextEditorString({
      userId,
      ownerId: userId,
      textEditorString: discussionMessage.text,
      users,
      commonId: discussionMessage.commonId,
      getCommonPagePath,
      getCommonPageAboutTabPath,
      directParent,
      onUserClick,
      onFeedItemClick,
    });

    dispatch(
      cacheActions.addDiscussionMessageByDiscussionId({
        discussionId,
        discussionMessage: {
          ...discussionMessage,
          parsedText,
        },
      }),
    );
  };

  const deleteDiscussionMessage = useCallback(
    (discussionMessageId: string) => {
      dispatch(
        cacheActions.deleteDiscussionMessageById({
          discussionId,
          discussionMessageId,
        }),
      );
    },
    [discussionId],
  );

  const fetchRepliedMessages = async (
    messageId: string,
    endDate: Date,
  ): Promise<void> => {
    if (state.data?.find((item) => item.id === discussionId)) {
      return Promise.resolve();
    }

    const {
      updatedDiscussionMessages,
      removedDiscussionMessages,
      lastVisibleSnapshot,
    } = await DiscussionMessageService.getDiscussionMessagesByEndDate(
      discussionId,
      lastVisible && lastVisible[discussionId],
      endDate,
    );

    setLastVisible((prevVisible) => ({
      ...prevVisible,
      [discussionId]: lastVisibleSnapshot,
    }));
    const discussionsWithText = await Promise.all(
      updatedDiscussionMessages.map(async (discussionMessage) => {
        const isUserDiscussionMessage =
          checkIsUserDiscussionMessage(discussionMessage);
        const isSystemMessage =
          checkIsSystemDiscussionMessage(discussionMessage);

        const parsedText = await getTextFromTextEditorString({
          userId,
          ownerId: isUserDiscussionMessage ? discussionMessage.ownerId : null,
          textEditorString: discussionMessage.text,
          users,
          commonId: discussionMessage.commonId,
          systemMessage: isSystemMessage ? discussionMessage : undefined,
          getCommonPagePath,
          getCommonPageAboutTabPath,
          directParent,
          onUserClick,
          onFeedItemClick,
        });

        return {
          ...discussionMessage,
          parsedText,
        };
      }),
    );
    dispatch(
      cacheActions.updateDiscussionMessagesStateByDiscussionId({
        discussionId,
        removedDiscussionMessages,
        updatedDiscussionMessages: discussionsWithText,
      }),
    );
  };

  const fetchDiscussionMessages = () => {
    if (!discussionId || isEndOfList[discussionId]) {
      return null;
    }

    if (!state.data?.length) {
      setDefaultState({ ...DEFAULT_STATE });
    }

    DiscussionMessageService.subscribeToDiscussionMessagesByDiscussionId(
      discussionId,
      lastVisible && lastVisible[discussionId],
      async (
        addedDiscussionMessages,
        modifiedDiscussionMessages,
        removedDiscussionMessages,
        lastVisibleDocument,
      ) => {
        const updatedDiscussionMessages = [
          ...addedDiscussionMessages,
          ...modifiedDiscussionMessages,
        ];
        setLastVisible((prevVisible) => ({
          ...prevVisible,
          [discussionId]: lastVisibleDocument,
        }));

        const hasLastVisibleDocument = !!lastVisibleDocument?.data();

        const discussionsWithText = await Promise.all(
          updatedDiscussionMessages.map(async (discussionMessage) => {

            const isUserDiscussionMessage =
              checkIsUserDiscussionMessage(discussionMessage);
            const isSystemMessage =
              checkIsSystemDiscussionMessage(discussionMessage);

            const parsedText = await getTextFromTextEditorString({
              userId,
              ownerId: isUserDiscussionMessage ? discussionMessage.ownerId : null,
              textEditorString: discussionMessage.text,
              users,
              commonId: discussionMessage.commonId,
              systemMessage: isSystemMessage ? discussionMessage : undefined,
              getCommonPagePath,
              getCommonPageAboutTabPath,
              directParent,
              onUserClick,
              onFeedItemClick,
            });

            return {
              ...discussionMessage,
              parsedText,
            };
          }),
        );
        dispatch(
          cacheActions.updateDiscussionMessagesStateByDiscussionId({
            discussionId,
            removedDiscussionMessages,
            updatedDiscussionMessages: discussionsWithText,
          }),
        );
        if (discussionsWithText.length < 15 && !hasLastVisibleDocument) {
          setIsEndOfList((prevIsEndOfList) => ({
            ...prevIsEndOfList,
            [discussionId]: true,
          }));
        }
      },
    );
  };

  useEffect(() => {
    (async () => {
      if (discussionMessagesWithOwners?.length === 0) {
        setIsLoading(true);
      }
      const discussionMessages = [...(state.data || [])];
      const filteredMessages = discussionMessages.filter(
        ({ moderation }) =>
          moderation?.flag !== ModerationFlags.Hidden || hasPermissionToHide,
      );
      const loadedDiscussionMessages = filteredMessages.map((d) => {
        const newDiscussionMessage = { ...d };
        const parentMessage = filteredMessages.find(
          ({ id }) => id === d.parentId,
        );
        if (
          checkIsUserDiscussionMessage(d) &&
          checkIsUserDiscussionMessage(newDiscussionMessage)
        ) {
          newDiscussionMessage.owner = users.find((o) => o.uid === d.ownerId);
        }
        newDiscussionMessage.parentMessage = parentMessage
          ? {
              id: parentMessage.id,
              text: parentMessage.text,
              ownerName: parentMessage?.ownerName,
              ...(checkIsUserDiscussionMessage(parentMessage) && {
                ownerId: parentMessage.ownerId,
              }),
              moderation: parentMessage?.moderation,
              images: parentMessage?.images,
              files: parentMessage?.files,
              createdAt: parentMessage.createdAt,
            }
          : null;
        return newDiscussionMessage;
      });

      setDiscussionMessagesWithOwners(loadedDiscussionMessages);
      setIsLoading(false);
    })();
  }, [state.data, hasPermissionToHide, users]);

  return {
    ...state,
    loading: isLoading || state.loading,
    data: discussionMessagesWithOwners,
    rawData: state.data,
    isEndOfList,
    fetchDiscussionMessages,
    fetchRepliedMessages,
    addDiscussionMessage,
    deleteDiscussionMessage,
  };
};
