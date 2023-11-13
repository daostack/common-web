import {  useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from 'classnames';
import { isEqual, xor } from "lodash";
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
  directParent?: DirectParent | null;
  onUserClick?: (userId: string) => void;
  onFeedItemClick?: (feedItemId: string) => void;
  users: User[];
  textStyles: TextStyles;
}

type State = LoadingState<DiscussionMessageWithParsedText[] | null>;

interface Return extends State {
  fetchDiscussionMessages: (discussionId: string) => void;
  addDiscussionMessage: (
    discussionId: string,
    discussionMessage: DiscussionMessage,
  ) => void;
  isEndOfList: boolean;
}

const DEFAULT_STATE: State = {
  loading: false,
  fetched: false,
  data: null,
};

export const useDiscussionMessagesById = ({
  hasPermissionToHide,
  userId,
  directParent,
  onUserClick,
  onFeedItemClick,
  users,
  textStyles
}: Options): Return => {
  const dispatch = useDispatch();
  const { getCommonPagePath, getCommonPageAboutTabPath } = useRoutesContext();
  const [currentDiscussionId, setCurrentDiscussionId] = useState("");
  const [defaultState, setDefaultState] = useState({ ...DEFAULT_STATE });
  const [messageOwners, setMessageOwners] = useState<User[]>([]);
  const [messageOwnersIds, setMessageOwnersIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [isEndOfList, setIsEndOfList] = useState(false);
  const state =
    useSelector(
      selectDiscussionMessagesStateByDiscussionId(currentDiscussionId),
    ) || defaultState;
  const [discussionMessagesWithOwners, setDiscussionMessagesWithOwners] =
    useState<any>();

  const addDiscussionMessage = async (
    discussionId: string,
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

  const fetchDiscussionMessages = (discussionId: string) => {
    setCurrentDiscussionId(discussionId);
    if (
      !discussionId ||
      isLoading ||
      isEndOfList
    ) {
      return null;
    }

    if(state.data?.length === 0) {
      setDefaultState({ ...DEFAULT_STATE });
    }

    DiscussionMessageService.getDiscussionMessagesByDiscussionId(
      discussionId,
      lastVisible,
      async (snapshot, updatedDiscussionMessages) => {
          const lastVisibleDocument =
            snapshot.docs[updatedDiscussionMessages.length - 1];

          setLastVisible(lastVisibleDocument);

          const hasLastVisibleDocument = !!lastVisibleDocument?.data();
          
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
            
            if (
              discussionsWithText.length < 15 &&
              !hasLastVisibleDocument
            ) {
              setIsEndOfList(true);
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
      setIsLoading(true);
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
    loading: state.loading || isLoading,
    data: discussionMessagesWithOwners,
    isEndOfList,
    fetchDiscussionMessages,
    addDiscussionMessage,
  };
};
