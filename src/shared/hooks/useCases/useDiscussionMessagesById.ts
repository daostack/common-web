import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateEffect } from "react-use";
import classNames from 'classnames';
import { isEqual, xor } from "lodash";
import firebase from "@/shared/utils/firebase";
import { fetchOwners } from "@/pages/OldCommon/store/api";
import { DiscussionMessageService } from "@/services";
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
import {
  cacheActions,
  selectDiscussionMessagesStateByDiscussionId,
} from "@/store/states";
import { countTextEditorEmojiElements, parseStringToTextEditorValue } from "@/shared/ui-kit";
import { getTextFromTextEditorString } from "@/shared/components/Chat/ChatMessage/utils";
import { useRoutesContext } from "@/shared/contexts";

export type TextStyles = {
  mentionTextCurrentUser: string;
  singleEmojiText: string;
  multipleEmojiText: string;
}

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
  textStyles
}: Options): Return => {
  const dispatch = useDispatch();
  const { getCommonPagePath, getCommonPageAboutTabPath } = useRoutesContext();
  const [defaultState, setDefaultState] = useState({ ...DEFAULT_STATE });
  const [messageOwners, setMessageOwners] = useState<User[]>([]);
  const [messageOwnersIds, setMessageOwnersIds] = useState<string[]>([]);
  const [lastVisible, setLastVisible] = useState<Record<string, firebase.firestore.QueryDocumentSnapshot<DiscussionMessage>>>({});
  const [isEndOfList, setIsEndOfList] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const state =
    useSelector(
      selectDiscussionMessagesStateByDiscussionId(discussionId),
    ) || defaultState;
  const [discussionMessagesWithOwners, setDiscussionMessagesWithOwners] =
    useState<any>();

  useUpdateEffect(() => {
    if (discussionId) {
      setDiscussionMessagesWithOwners([]);
    }

  }, [discussionId])

  const addDiscussionMessage = async (
    discussionMessage: DiscussionMessage,
  ): Promise<void> => {

    const emojiCount = countTextEditorEmojiElements(
      parseStringToTextEditorValue(discussionMessage.text),
    );
    const parsedText = await getTextFromTextEditorString({
      textEditorString: discussionMessage.text,
      users,
      mentionTextClassName: textStyles.mentionTextCurrentUser,
      emojiTextClassName: classNames({
        [textStyles.singleEmojiText]: emojiCount.isSingleEmoji,
        [textStyles.multipleEmojiText]: emojiCount.isMultipleEmoji,
      }),
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

  const deleteDiscussionMessage = useCallback((discussionMessageId: string) => {
    dispatch(
      cacheActions.deleteDiscussionMessageById({
        discussionId,
        discussionMessageId
      })
    )
  }, []);

  const fetchRepliedMessages = async (messageId: string, endDate: Date): Promise<void> => {
    if (state.data?.find((item) => item.id === discussionId)) {
      return Promise.resolve();
    }

    const { data: updatedDiscussionMessages, lastVisibleSnapshot } = await DiscussionMessageService.getDiscussionMessagesByEndDate(discussionId, lastVisible && lastVisible[discussionId], endDate);

    setLastVisible((prevVisible) => ({ ...prevVisible, [discussionId]: lastVisibleSnapshot }));
    const discussionsWithText = await Promise.all((updatedDiscussionMessages.map(async (discussionMessage) => {
      const emojiCount = countTextEditorEmojiElements(
        parseStringToTextEditorValue(discussionMessage.text),
      );

      const isUserDiscussionMessage =
        checkIsUserDiscussionMessage(discussionMessage);
      const isSystemMessage = checkIsSystemDiscussionMessage(discussionMessage);

      const isNotCurrentUserMessage =
        !isUserDiscussionMessage || userId !== discussionMessage.ownerId;
      const parsedText = await getTextFromTextEditorString({
        textEditorString: discussionMessage.text,
        users,
        mentionTextClassName: !isNotCurrentUserMessage
          ? textStyles.mentionTextCurrentUser
          : "",
        emojiTextClassName: classNames({
          [textStyles.singleEmojiText]: emojiCount.isSingleEmoji,
          [textStyles.multipleEmojiText]: emojiCount.isMultipleEmoji,
        }),
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
      }
    })))
    dispatch(
      cacheActions.updateDiscussionMessagesStateByDiscussionId({
        discussionId,
        state: {
          loading: false,
          fetched: true,
          data: discussionsWithText as any,
        },
      }),
    )
  }

  const fetchDiscussionMessages = () => {
    if (
      !discussionId ||
      isEndOfList[discussionId]
    ) {
      return null;
    }

    if (!state.data?.length) {
      setDefaultState({ ...DEFAULT_STATE });
    }

    DiscussionMessageService.getDiscussionMessagesByDiscussionId(
      discussionId,
      lastVisible && lastVisible[discussionId],
      async (snapshot, updatedDiscussionMessages) => {
        const lastVisibleDocument = snapshot.docs[updatedDiscussionMessages.length - 1];

        setLastVisible((prevVisible) => ({ ...prevVisible, [discussionId]: lastVisibleDocument }));

        const hasLastVisibleDocument = !!lastVisibleDocument?.data();

        const discussionsWithText = await Promise.all((updatedDiscussionMessages.map(async (discussionMessage) => {
          const emojiCount = countTextEditorEmojiElements(
            parseStringToTextEditorValue(discussionMessage.text),
          );

          const isUserDiscussionMessage = checkIsUserDiscussionMessage(discussionMessage);
          const isSystemMessage = checkIsSystemDiscussionMessage(discussionMessage);

          const isNotCurrentUserMessage =
            !isUserDiscussionMessage || userId !== discussionMessage.ownerId;
          const parsedText = await getTextFromTextEditorString({
            textEditorString: discussionMessage.text,
            users,
            mentionTextClassName: !isNotCurrentUserMessage
              ? textStyles.mentionTextCurrentUser
              : "",
            emojiTextClassName: classNames({
              [textStyles.singleEmojiText]: emojiCount.isSingleEmoji,
              [textStyles.multipleEmojiText]: emojiCount.isMultipleEmoji,
            }),
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
          }
        })));
        dispatch(
          cacheActions.updateDiscussionMessagesStateByDiscussionId({
            discussionId,
            state: {
              loading: false,
              fetched: true,
              data: discussionsWithText as any,
            },
          }),
        )

        if (
          discussionsWithText.length < 15 &&
          !hasLastVisibleDocument
        ) {
          setIsEndOfList((prevIsEndOfList) => ({ ...prevIsEndOfList, [discussionId]: true }));
        }
      },
    );
  };

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
      if(discussionMessagesWithOwners?.length === 0) {
        setIsLoading(true);
      }
      const discussionMessages = [...(state.data || [])];
      const filteredMessages = discussionMessages.filter(
        ({ moderation }) =>
          moderation?.flag !== ModerationFlags.Hidden || hasPermissionToHide,
      );
      const ownerIds = Array.from(
        new Set(
          filteredMessages
            ?.filter(checkIsUserDiscussionMessage)
            .map((d) => d.ownerId),
        ),
      ) as string[];
      const owners = await fetchMessageOwners(ownerIds);

      const loadedDiscussionMessages = await Promise.all(filteredMessages.map(async (d) => {
        const newDiscussionMessage = { ...d };
        const parentMessage = filteredMessages.find(
          ({ id }) => id === d.parentId,
        );
        if (
          checkIsUserDiscussionMessage(d) &&
          checkIsUserDiscussionMessage(newDiscussionMessage)
        ) {
          newDiscussionMessage.owner = owners.find((o) => o.uid === d.ownerId);
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
            createdAt: parentMessage.createdAt
          }
          : null;
        return newDiscussionMessage;
      }));

      setDiscussionMessagesWithOwners(loadedDiscussionMessages);
      setIsLoading(false);
    })();
  }, [state.data, messageOwnersIds, messageOwners, hasPermissionToHide]);

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
