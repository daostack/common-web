import { useState, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDeepCompareEffect, useUpdateEffect } from "react-use";
import { trace } from "firebase/performance";
import {
  DiscussionMessageService,
  MESSAGES_NUMBER_IN_BATCH,
  UserService,
} from "@/services";
import { getTextFromTextEditorString } from "@/shared/components/Chat/ChatMessage/utils";
import { AI_PRO_USER, AI_USER } from "@/shared/constants";
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
import { InternalLinkData } from "@/shared/utils";
import firebase, { perf } from "@/shared/utils/firebase";
import {
  cacheActions,
  selectDiscussionMessagesStateByDiscussionId,
  selectExternalCommonUsers,
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
  onStreamMentionClick?: ((feedItemId: string, options?: { commonId?: string; messageId?: string }) => void) | ((data: InternalLinkData) => void);
  onFeedItemClick?: (feedItemId: string) => void;
  users: User[];
  textStyles: TextStyles;
  onInternalLinkClick?: (data: InternalLinkData) => void;
}

interface AddDiscussionMessageOptions {
  showPlainText?: boolean;
}

type State = LoadingState<DiscussionMessageWithParsedText[] | null>;

interface Return extends State {
  fetchDiscussionMessages: () => void;
  fetchRepliedMessages: (messageId: string, endDate: Date) => Promise<void>;
  addDiscussionMessage: (
    discussionMessage: DiscussionMessage,
    options?: AddDiscussionMessageOptions,
  ) => void;
  deleteDiscussionMessage: (discussionMessageId: string) => void;
  isEndOfList: Record<string, boolean> | null;
  isFirstBatchLoaded?: boolean;
  isBatchLoading: boolean;
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
  onStreamMentionClick,
  onFeedItemClick,
  users,
  onInternalLinkClick,
}: Options): Return => {
  const dispatch = useDispatch();
  const externalCommonUsers = useSelector(selectExternalCommonUsers);
  const { getCommonPagePath, getCommonPageAboutTabPath } = useRoutesContext();
  const [defaultState, setDefaultState] = useState({ ...DEFAULT_STATE });
  const [lastVisible, setLastVisible] = useState<
    Record<string, firebase.firestore.QueryDocumentSnapshot<DiscussionMessage>>
  >({});
  const [isEndOfList, setIsEndOfList] = useState<Record<string, boolean>>({});
  const [isFirstBatchLoaded, setIsFirstBatchLoaded] = useState<
    Record<string, boolean>
  >({});
  const [isBatchLoading, setIsBatchLoading] = useState(false);
  const state =
    useSelector(selectDiscussionMessagesStateByDiscussionId(discussionId)) ||
    defaultState;
  const [discussionMessagesWithOwners, setDiscussionMessagesWithOwners] =
    useState<any>();

  const unsubscribeRef = useRef<firebase.Unsubscribe | null>(null);

  useUpdateEffect(() => {
    if (discussionId) {
      setDiscussionMessagesWithOwners([]);
    }

    return () => {
      setIsBatchLoading(false);
    };
  }, [discussionId]);

  const addDiscussionMessage = async (
    discussionMessage: DiscussionMessage,
    options?: AddDiscussionMessageOptions,
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
      onStreamMentionClick: onStreamMentionClick ?? onFeedItemClick,
      onFeedItemClick,
      onInternalLinkClick,
      showPlainText: options?.showPlainText,
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

  const fetchRepliedMessages = useCallback(
    async (messageId: string, endDate: Date): Promise<void> => {
      const fetchRepliedMessagesTrace = trace(perf, 'fetchRepliedMessagesTrace');
      try {
        fetchRepliedMessagesTrace.start();

        if (state.data?.find((item) => item.id === messageId)) {
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
              onStreamMentionClick: onStreamMentionClick ?? onFeedItemClick,
              onFeedItemClick,
              onInternalLinkClick,
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
        fetchRepliedMessagesTrace.stop();
      } catch(err) {
        fetchRepliedMessagesTrace.stop();
      }
    },
    [
      state.data,
      discussionId,
      userId,
      users,
      directParent,
      lastVisible,
      getCommonPagePath,
      getCommonPageAboutTabPath,
      onUserClick,
      onStreamMentionClick,
      onFeedItemClick,
      onInternalLinkClick,
    ],
  );

  const fetchDiscussionMessages = useCallback(() => {
    if (
      !discussionId ||
      isEndOfList[discussionId] ||
      state.loading ||
      isBatchLoading
    ) {
      return null;
    }

    if (!state.data?.length) {
      setDefaultState({ ...DEFAULT_STATE });
    } else if (state.data.length >= MESSAGES_NUMBER_IN_BATCH) {
      setIsBatchLoading(true);
    }

    try {
      const fetchDiscussionMessagesTrace = trace(perf, 'fetchDiscussionMessages');
      fetchDiscussionMessagesTrace.start();

      unsubscribeRef.current = DiscussionMessageService.subscribeToDiscussionMessagesByDiscussionId(
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
                ownerId: isUserDiscussionMessage
                  ? discussionMessage.ownerId
                  : null,
                textEditorString: discussionMessage.text,
                users,
                commonId: discussionMessage.commonId,
                systemMessage: isSystemMessage ? discussionMessage : undefined,
                getCommonPagePath,
                getCommonPageAboutTabPath,
                directParent,
                onUserClick,
                onStreamMentionClick: onStreamMentionClick ?? onFeedItemClick,
                onFeedItemClick,
                onInternalLinkClick,
              });

              return {
                ...discussionMessage,
                parsedText,
              };
            }),
          );
          if (
            discussionsWithText.length < MESSAGES_NUMBER_IN_BATCH &&
            !hasLastVisibleDocument
          ) {
            setIsEndOfList((prevIsEndOfList) => ({
              ...prevIsEndOfList,
              [discussionId]: true,
            }));
          }
          dispatch(
            cacheActions.updateDiscussionMessagesStateByDiscussionId({
              discussionId,
              removedDiscussionMessages,
              updatedDiscussionMessages: discussionsWithText,
            }),
          );
          setIsBatchLoading(false);
        },
      );
      fetchDiscussionMessagesTrace.stop();
    } catch (err) {
      setIsBatchLoading(false);
    }
  }, [
    discussionId,
    isEndOfList,
    state.loading,
    state.data,
    isBatchLoading,
    lastVisible,
    userId,
    users,
    directParent,
    getCommonPagePath,
    getCommonPageAboutTabPath,
    onUserClick,
    onStreamMentionClick,
    onFeedItemClick,
    onInternalLinkClick,
    dispatch,
  ]);

  useEffect(() => {
    // Cleanup subscription on unmount or when discussionId changes
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [discussionId]);

  useDeepCompareEffect(() => {
    (async () => {
      if(Array.isArray(state.data) && state.data.length === 0) {
        setIsFirstBatchLoaded((prev) => ({
          ...prev,
          [discussionId]: true,
        }));
        setDiscussionMessagesWithOwners([]);
      }

      if (!state.data) {
        setDiscussionMessagesWithOwners([]);
        return;
      }

      try {
        const discussionMessages = [...state.data];

        const filteredMessages = discussionMessages.filter(
          ({ moderation }) =>
            moderation?.flag !== ModerationFlags.Hidden || hasPermissionToHide,
        );
        const loadedDiscussionMessages = await Promise.all(
          filteredMessages.map(async (d) => {
            const newDiscussionMessage = { ...d };
            const parentMessage = filteredMessages.find(
              ({ id }) => id === d.parentId,
            );
            if (
              checkIsUserDiscussionMessage(d) &&
              checkIsUserDiscussionMessage(newDiscussionMessage)
            ) {
              const commonMemberMessageOwner = [
                AI_USER,
                AI_PRO_USER,
                ...users,
                ...externalCommonUsers,
              ].find((o) => o.uid === d.ownerId);
              const messageOwner =
                commonMemberMessageOwner ||
                (await UserService.getUserById(d.ownerId));
              newDiscussionMessage.owner = messageOwner;
              if (!commonMemberMessageOwner && messageOwner) {
                dispatch(
                  cacheActions.addUserToExternalCommonUsers({
                    user: messageOwner,
                  }),
                );
              }
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
          }),
        );
  
        setDiscussionMessagesWithOwners(loadedDiscussionMessages);
        setIsFirstBatchLoaded((prev) => ({
          ...prev,
          [discussionId]: true,
        }));
      } catch(err) {
        setDiscussionMessagesWithOwners([]);
        setIsFirstBatchLoaded((prev) => ({
          ...prev,
          [discussionId]: true,
        }));
      }
    })();
  }, [state.data, hasPermissionToHide, users, externalCommonUsers, discussionId]);

  return {
    ...state,
    loading: !isFirstBatchLoaded[discussionId] || state.loading,
    data: discussionMessagesWithOwners,
    rawData: state.data,
    isEndOfList,
    isFirstBatchLoaded: isFirstBatchLoaded[discussionId],
    isBatchLoading,
    fetchDiscussionMessages,
    fetchRepliedMessages,
    addDiscussionMessage,
    deleteDiscussionMessage,
  };
};
