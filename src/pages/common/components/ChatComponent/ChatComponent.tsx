import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  ChangeEvent,
  useRef,
  ReactNode,
  useLayoutEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce, useMeasure, useScroll } from "react-use";
import classNames from "classnames";
import isHotkey from "is-hotkey";
import { debounce } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { selectUser } from "@/pages/Auth/store/selectors";
import { FileService } from "@/services";
import { Separator } from "@/shared/components";
import {
  ChatType,
  DiscussionMessageOwnerType,
  GovernanceActions,
  LastSeenEntity,
  QueryParamKey,
} from "@/shared/constants";
import { HotKeys } from "@/shared/constants/keyboardKeys";
import { ChatMessageToUserDiscussionMessageConverter } from "@/shared/converters";
import {
  useZoomDisabling,
  useImageSizeCheck,
  useQueryParams,
} from "@/shared/hooks";
import { ArrowInCircleIcon } from "@/shared/icons";
import { LinkPreviewData } from "@/shared/interfaces";
import { CreateDiscussionMessageDto } from "@/shared/interfaces/api/discussionMessages";
import {
  ChatChannel,
  checkIsUserDiscussionMessage,
  Circles,
  CommonFeedObjectUserUnique,
  CommonMember,
  DirectParent,
  Discussion,
  DiscussionMessageWithParsedText,
  Timestamp,
  UserDiscussionMessage,
} from "@/shared/models";
import {
  TextEditorValue,
  getMentionTags,
  parseStringToTextEditorValue,
  checkIsTextEditorValueEmpty,
  removeTextEditorEmptyEndLinesValues,
  countTextEditorEmojiElements,
} from "@/shared/ui-kit";
import { BaseTextEditorHandles } from "@/shared/ui-kit/TextEditor/BaseTextEditor";
import { checkUncheckedItemsInTextEditorValue } from "@/shared/ui-kit/TextEditor/utils";
import { InternalLinkData, notEmpty } from "@/shared/utils";
import { getUserName, hasPermission, isMobile } from "@/shared/utils";
import {
  chatActions,
  selectCurrentDiscussionMessageReply,
  selectFilesPreview,
  FileInfo,
  selectOptimisticFeedItems,
  commonActions,
  selectOptimisticDiscussionMessages,
  inboxActions,
  optimisticActions,
  selectInstantDiscussionMessagesOrder,
} from "@/store/states";
import { ChatContentContext, ChatContentData } from "../CommonContent/context";
import { useFeedItemContext } from "../FeedItem";
import {
  ChatContent,
  ChatContentRef,
  MessageLinkPreview,
  MessageReply,
  ChatFilePreview,
  MessageInfoWithDateList,
  ChatInput,
} from "./components";
import { checkIsLastSeenInPreviousDay } from "./components/ChatContent/utils";
import { useChatChannelChatAdapter, useDiscussionChatAdapter } from "./hooks";
import {
  getLastNonUserMessage,
  sendMessages,
  uploadFilesAndImages,
} from "./utils";
import styles from "./ChatComponent.module.scss";

const BASE_CHAT_INPUT_HEIGHT = 48;
const BASE_ORDER_INTERVAL = 1000;

interface ChatComponentInterface {
  commonId: string;
  type: ChatType;
  isCommonMemberFetched: boolean;
  governanceCircles?: Circles;
  commonMember: CommonMember | null;
  hasAccess?: boolean;
  discussion?: Discussion;
  chatChannel?: ChatChannel;
  lastSeenItem?: CommonFeedObjectUserUnique["lastSeen"];
  feedItemId: string;
  isAuthorized?: boolean;
  isHidden: boolean;
  count?: number;
  seenOnce?: boolean;
  seen?: boolean;
  onMessagesAmountChange?: (newMessagesAmount: number) => void;
  directParent?: DirectParent | null;
  renderChatInput?: () => ReactNode;
  onUserClick?: (userId: string) => void;
  onFeedItemClick?: (feedItemId: string) => void;
  onInternalLinkClick?: (data: InternalLinkData) => void;
}

interface Messages {
  [key: number]: DiscussionMessageWithParsedText[];
}

type CreateDiscussionMessageDtoWithFilesPreview = CreateDiscussionMessageDto & {
  filesPreview?: FileInfo[] | null;
  imagesPreview?: FileInfo[] | null;
};

function groupday(
  acc: any,
  currentValue: DiscussionMessageWithParsedText,
): Messages {
  const d = new Date(currentValue.createdAt.seconds * 1000);
  const i = Math.floor(d.getTime() / (1000 * 60 * 60 * 24));
  const timestamp = i * (1000 * 60 * 60 * 24);
  acc[timestamp] = acc[timestamp] || [];
  acc[timestamp].push(currentValue);
  return acc;
}

const CHAT_HOT_KEYS = [HotKeys.Enter, HotKeys.ModEnter, HotKeys.ShiftEnter];

const SCROLL_THRESHOLD = 400;

export default function ChatComponent({
  commonId,
  type,
  governanceCircles,
  commonMember,
  discussion,
  chatChannel,
  hasAccess = true,
  lastSeenItem,
  feedItemId,
  isAuthorized,
  isHidden = false,
  count,
  seenOnce,
  seen,
  onMessagesAmountChange,
  directParent,
  renderChatInput: renderChatInputOuter,
  onUserClick,
  onFeedItemClick,
  onInternalLinkClick,
}: ChatComponentInterface) {
  const dispatch = useDispatch();
  const queryParams = useQueryParams();
  const shouldDisplayMessagesOnlyWithUncheckedItems =
    queryParams[QueryParamKey.Unchecked] === "true";
  const { checkImageSize } = useImageSizeCheck();
  useZoomDisabling();
  const textInputRef = useRef<BaseTextEditorHandles>(null);
  const editorRef = useRef<HTMLElement>(null);
  const [inputContainerRef, { height: chatInputHeight }] =
    useMeasure<HTMLDivElement>();
  const discussionMessageReply = useSelector(
    selectCurrentDiscussionMessageReply(),
  );
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const discussionId = discussion?.id || "";
  const isChatChannel = Boolean(chatChannel);

  const hasPermissionToHide =
    commonMember && governanceCircles
      ? hasPermission({
          commonMember,
          governance: {
            circles: governanceCircles,
          },
          action: GovernanceActions.HIDE_OR_UNHIDE_MESSAGE,
        })
      : false;
  const {
    discussionMessagesData,
    markDiscussionMessageItemAsSeen,
    discussionUsers,
    fetchDiscussionUsers,
  } = useDiscussionChatAdapter({
    discussionId,
    hasPermissionToHide,
    textStyles: {
      mentionTextCurrentUser: styles.mentionTextCurrentUser,
      singleEmojiText: styles.singleEmojiText,
      multipleEmojiText: styles.multipleEmojiText,
    },
    onFeedItemClick,
    onUserClick,
    commonId,
    onInternalLinkClick,
  });
  const {
    chatMessagesData,
    markChatMessageItemAsSeen,
    markChatChannelAsSeen,
    chatUsers,
    fetchChatUsers,
  } = useChatChannelChatAdapter({
    chatChannelId: chatChannel?.id || "",
    participants: chatChannel?.participants,
  });
  const users = useMemo(
    () => (chatChannel ? chatUsers : discussionUsers),
    [chatUsers, discussionUsers, chatChannel],
  );
  const discussionMessages = useMemo(
    () =>
      chatChannel ? chatMessagesData.data : discussionMessagesData.data || [],
    [chatChannel, chatMessagesData.data, discussionMessagesData.data],
  );
  const isFetchedDiscussionMessages =
    discussionMessagesData.fetched || chatMessagesData.fetched;
  const areInitialMessagesLoading = isChatChannel
    ? chatMessagesData.loading
    : discussionMessagesData.loading;
  const areMessagesLoading = chatChannel
    ? chatMessagesData.isBatchLoading
    : discussionMessagesData.isBatchLoading;
  const currentFilesPreview = useSelector(selectFilesPreview());
  const chatContentRef = useRef<ChatContentRef>(null);
  const chatWrapperId = useMemo(() => `chat-wrapper-${uuidv4()}`, []);
  const chatInputWrapperRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [linkPreviewData, setLinkPreviewData] = useState<
    LinkPreviewData | null | undefined
  >();
  const chatContentContextValue: ChatContentData = useMemo(
    () => ({
      isScrolling,
      chatContentRect: chatContainerRef.current?.getBoundingClientRect(),
    }),
    [isScrolling, chatContainerRef.current],
  );
  const shouldHideChatInput = !isChatChannel && (!hasAccess || isHidden);

  const [message, setMessage] = useState<TextEditorValue>(
    parseStringToTextEditorValue(),
  );

  const { setIsInputFocused } = useFeedItemContext();

  useEffect(() => {
    const isEmpty = checkIsTextEditorValueEmpty(message);
    if (!isEmpty || message.length > 1) {
      setIsInputFocused?.(true);
    } else {
      setIsInputFocused?.(false);
    }
  }, [message, setIsInputFocused]);

  const emojiCount = useMemo(
    () => countTextEditorEmojiElements(message),
    [message],
  );
  const [shouldReinitializeEditor, setShouldReinitializeEditor] =
    useState(false);
  const onClear = () => {
    textInputRef?.current?.clear?.();
    setShouldReinitializeEditor(true);
    setMessage(parseStringToTextEditorValue());
  };

  const [isMultiLineInput, setIsMultiLineInput] = useState(false);
  const prevFeedItemId = useRef<string>();
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>();

  const optimisticFeedItems = useSelector(selectOptimisticFeedItems);

  const optimisticDiscussionMessages = useSelector(
    selectOptimisticDiscussionMessages,
  );
  const instantDiscussionMessagesOrder = useSelector(
    selectInstantDiscussionMessagesOrder,
  );

  const currentChatOrder =
    instantDiscussionMessagesOrder.get(discussionId)?.order || 1;

  const isOptimisticChat = optimisticFeedItems.has(discussionId);

  useEffect(() => {
    if (optimisticDiscussionMessages.size > 0) {
      const entries = Array.from(optimisticDiscussionMessages.entries());
      (async () => {
        await Promise.all(
          entries.map(async ([optimisticMessageDiscussionId, messages]) => {
            if (!optimisticFeedItems.has(optimisticMessageDiscussionId)) {
              const newMessagesWithFiles = await uploadFilesAndImages(messages);
              await sendMessages({
                newMessagesWithFiles,
                updateChatMessage: chatMessagesData.updateChatMessage,
                chatChannel,
                discussionId: optimisticMessageDiscussionId,
                dispatch,
              });

              dispatch(
                optimisticActions.clearOptimisticDiscussionMessages(
                  optimisticMessageDiscussionId,
                ),
              );

              return messages;
            }

            return messages;
          }),
        );
      })();
    }
  }, [
    optimisticFeedItems,
    optimisticDiscussionMessages,
    chatChannel,
    chatMessagesData.updateChatMessage,
  ]);

  useEffect(() => {
    return () => {
      prevFeedItemId.current = feedItemId;
    };
  }, [feedItemId]);

  useEffect(() => {
    setIsMultiLineInput(chatInputHeight > BASE_CHAT_INPUT_HEIGHT);
  }, [chatInputHeight]);

  useEffect(() => {
    if (commonId && !isChatChannel) {
      fetchDiscussionUsers(commonId, discussion?.circleVisibility);
    }
  }, [commonId, discussion?.circleVisibility]);

  useEffect(() => {
    if (chatChannel?.id) {
      chatMessagesData.fetchChatMessages(chatChannel.id);
      fetchChatUsers();
    }
  }, [chatChannel?.id]);

  const lastNonUserMessage = getLastNonUserMessage(
    discussionMessages || [],
    discussionId,
    userId,
  );

  const messages = useMemo(
    () =>
      ((discussionMessages ?? []) as DiscussionMessageWithParsedText[]).reduce(
        groupday,
        {},
      ),
    [discussionMessages],
  );

  const dateList: MessageInfoWithDateList = useMemo(() => {
    const messagesDates = Object.keys(messages);
    const messagesWithInfo = messagesDates.map((day, dayIndex) => {
      const date = new Date(Number(day));
      const currentMessages = shouldDisplayMessagesOnlyWithUncheckedItems
        ? messages[Number(day)].filter((message) => message.hasUncheckedItems)
        : messages[Number(day)];
      const previousDayMessages =
        messages[Number(messagesDates[dayIndex + 1])] || [];
      const isLastSeenInPreviousDay = checkIsLastSeenInPreviousDay(
        previousDayMessages,
        lastSeenItem?.id,
      );
      const isMyMessageFirst =
        checkIsUserDiscussionMessage(currentMessages[0]) &&
        currentMessages[0].ownerId === userId;
      const newSeparatorEl = (
        <li>
          <Separator>New</Separator>
        </li>
      );

      return {
        day,
        date,
        currentMessages,
        isLastSeenInPreviousDay,
        isMyMessageFirst,
        newSeparatorEl,
      };
    });

    return messagesWithInfo;
  }, [messages]);

  const [newMessages, setMessages] = useState<
    CreateDiscussionMessageDtoWithFilesPreview[]
  >([]);

  const canSendMessage =
    !checkIsTextEditorValueEmpty(message) || currentFilesPreview?.length;

  const focusOnChat = () => {
    editorRef.current?.focus();
  };

  useDebounce(
    async () => {
      const newMessagesWithFiles = await uploadFilesAndImages(newMessages);
      await sendMessages({
        newMessagesWithFiles,
        updateChatMessage: chatMessagesData.updateChatMessage,
        chatChannel,
        discussionId,
        dispatch,
      });

      if (newMessages.length > 0) {
        setMessages([]);
      }
    },
    1500 + BASE_ORDER_INTERVAL * currentChatOrder,
    [newMessages, discussionId, dispatch, currentChatOrder],
  );

  /**
   * Since the component's state is stale while executing the "paste" event listener callback,
   * we need to save it in a ref and update it so the fresh data is available in the callback.
   */
  const currentFilesPreviewRef = useRef(currentFilesPreview);
  currentFilesPreviewRef.current = currentFilesPreview;

  const uploadFiles = (
    event: ChangeEvent<HTMLInputElement> | ClipboardEvent,
  ) => {
    let files: FileList | undefined | null;
    if (event instanceof ClipboardEvent) {
      files = event.clipboardData?.files;
    } else {
      files = event.target.files;
    }

    const newFilesPreview = Array.from(files || [])
      .map((file) => {
        if (!checkImageSize(file.name, file.size)) {
          return null;
        }

        return {
          info: file,
          src: URL.createObjectURL(file),
          size: file.size,
          name: file.name,
        };
      })
      .filter(Boolean) as FileInfo[];
    dispatch(
      chatActions.setFilesPreview(
        [...(currentFilesPreviewRef.current ?? []), ...newFilesPreview].slice(
          0,
          10,
        ),
      ),
    );
  };

  const sendMessage = useCallback(
    async (editorMessage: TextEditorValue) => {
      if (user && user.uid) {
        const pendingMessageId = uuidv4();
        const message = removeTextEditorEmptyEndLinesValues(editorMessage);

        const mentionTags = getMentionTags(message).map((tag) => ({
          value: tag.userId,
        }));
        const imagesPreview = FileService.getImageTypeFromFiles(
          currentFilesPreview ?? [],
        );
        const filesPreview = FileService.getExcludeImageTypeFromFiles(
          currentFilesPreview ?? [],
        );
        const isEmptyText = checkIsTextEditorValueEmpty(message);
        const isFilesMessageWithoutTextAndImages =
          filesPreview.length > 0 && isEmptyText && imagesPreview.length === 0;

        const payload: CreateDiscussionMessageDtoWithFilesPreview = {
          pendingMessageId,
          text: JSON.stringify(message),
          ownerId: user.uid,
          commonId,
          discussionId,
          ...(discussionMessageReply && {
            parentId: discussionMessageReply?.id,
          }),
          imagesPreview,
          filesPreview: [],
          tags: mentionTags,
          mentions: mentionTags.map((tag) => tag.value),
          hasUncheckedItems: checkUncheckedItemsInTextEditorValue(message),
          linkPreviews:
            typeof linkPreviewData === "undefined"
              ? undefined
              : linkPreviewData
              ? [linkPreviewData]
              : [],
        };

        const filePreviewPayload: CreateDiscussionMessageDtoWithFilesPreview[] =
          [];
        const pendingMessages: UserDiscussionMessage[] = [];

        const firebaseDate = Timestamp.fromDate(new Date());

        filesPreview.map((filePreview) => {
          const filePendingMessageId = uuidv4();

          filePreviewPayload.push({
            pendingMessageId: filePendingMessageId,
            ownerId: user.uid,
            commonId,
            discussionId,
            filesPreview: [filePreview],
            hasUncheckedItems: false,
          });

          pendingMessages.push({
            id: filePendingMessageId,
            text: JSON.stringify(parseStringToTextEditorValue()),
            owner: user,
            ownerAvatar: (user.photo || user.photoURL) as string,
            ownerType: DiscussionMessageOwnerType.User,
            ownerId: userId as string,
            ownerName: getUserName(user),
            commonId,
            discussionId,
            parentMessage: null,
            createdAt: firebaseDate,
            updatedAt: firebaseDate,
            files: [FileService.convertFileInfoToCommonLink(filePreview)],
            hasUncheckedItems: false,
          });
        });

        if (!isEmptyText || imagesPreview.length) {
          pendingMessages.push({
            id: pendingMessageId,
            owner: user,
            ownerAvatar: (user.photo || user.photoURL) as string,
            ownerType: DiscussionMessageOwnerType.User,
            ownerId: userId as string,
            ownerName: getUserName(user),
            text: JSON.stringify(message),
            commonId,
            discussionId,
            createdAt: firebaseDate,
            updatedAt: firebaseDate,
            parentId: discussionMessageReply?.id,
            parentMessage: discussionMessageReply?.id
              ? {
                  id: discussionMessageReply?.id,
                  ownerName: discussionMessageReply.ownerName,
                  ...(checkIsUserDiscussionMessage(discussionMessageReply) && {
                    ownerId: discussionMessageReply.ownerId,
                  }),
                  text: discussionMessageReply.text,
                  files: discussionMessageReply.files,
                  images: discussionMessageReply.images,
                  createdAt: discussionMessageReply.createdAt,
                }
              : null,
            images: imagesPreview?.map((file) =>
              FileService.convertFileInfoToCommonLink(file),
            ),
            tags: mentionTags,
            hasUncheckedItems: checkUncheckedItemsInTextEditorValue(message),
            linkPreviews: payload.linkPreviews,
          });
        }

        if (isOptimisticChat) {
          dispatch(optimisticActions.setOptimisticDiscussionMessages(payload));
        } else {
          setMessages((prev) => {
            if (isFilesMessageWithoutTextAndImages) {
              return [...prev, ...filePreviewPayload];
            }

            return [...prev, ...filePreviewPayload, payload];
          });
          dispatch(
            optimisticActions.setInstantDiscussionMessagesOrder({
              discussionId,
            }),
          );
        }

        if (isChatChannel) {
          pendingMessages.forEach((pendingMessage) => {
            chatMessagesData.addChatMessage(
              ChatMessageToUserDiscussionMessageConverter.toBaseEntity(
                pendingMessage,
              ),
            );
          });
        } else {
          pendingMessages.forEach((pendingMessage) => {
            discussionMessagesData.addDiscussionMessage(pendingMessage, {
              showPlainText: true,
            });
          });
        }

        if (discussionMessageReply) {
          dispatch(chatActions.clearCurrentDiscussionMessageReply());
        }
        if (currentFilesPreview) {
          dispatch(chatActions.clearFilesPreview());
        }

        const payloadUpdateFeedItem = {
          feedItemId,
          lastMessage: {
            messageId: pendingMessageId,
            ownerId: userId as string,
            userName: getUserName(user),
            ownerType: DiscussionMessageOwnerType.User,
            content: JSON.stringify(message),
          },
        };

        dispatch(
          commonActions.setFeedItemUpdatedAt({
            ...payloadUpdateFeedItem,
            commonId,
          }),
        );
        dispatch(inboxActions.setInboxItemUpdatedAt(payloadUpdateFeedItem));
        document
          .getElementById("feedLayoutWrapper")
          ?.scrollIntoView({ behavior: "smooth" });
        focusOnChat();
      }
    },
    [
      dispatch,
      user,
      discussionMessageReply,
      commonId,
      currentFilesPreview,
      discussionId,
      discussionMessages,
      isChatChannel,
      linkPreviewData,
      isOptimisticChat,
      feedItemId,
    ],
  );

  const onClearFinished = () => {
    setShouldReinitializeEditor(false);
  };

  const scrollToContainerBottom = () => {
    chatContentRef.current?.scrollToContainerBottom();
  };

  const sendChatMessage = (): void => {
    if (canSendMessage) {
      sendMessage && sendMessage(message);
      scrollToContainerBottom();
      onClear();
    }
  };

  const onEnterKeyDown = (event: React.KeyboardEvent<HTMLElement>): void => {
    const enteredHotkey = CHAT_HOT_KEYS.find((hotkey) =>
      isHotkey(hotkey, event),
    );
    if (!enteredHotkey) {
      return;
    }

    if (enteredHotkey === HotKeys.Enter && !isMobile()) {
      event.preventDefault();
      sendChatMessage();
      return;
    }
  };

  const handleMessageDelete = useCallback(
    (messageId: string) => {
      if (isChatChannel) {
        chatMessagesData.deleteChatMessage(messageId);
      } else {
        discussionMessagesData.deleteDiscussionMessage(messageId);
      }
    },
    [
      isChatChannel,
      chatMessagesData.deleteChatMessage,
      discussionMessagesData.deleteDiscussionMessage,
    ],
  );

  useEffect(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }

    if (seenOnce && notEmpty(seen) && seen && count === 0) {
      return;
    }

    const delay = prevFeedItemId.current ? 0 : 1500;

    if (isChatChannel) {
      timeoutId.current = markChatChannelAsSeen(feedItemId, delay);
    } else if (commonId) {
      timeoutId.current = markDiscussionMessageItemAsSeen(
        {
          feedObjectId: feedItemId,
          commonId,
        },
        delay,
      );
    }
  }, [feedItemId, commonId]);

  useEffect(() => {
    if (
      lastNonUserMessage &&
      lastSeenItem?.id !== lastNonUserMessage.id &&
      feedItemId
    ) {
      if (isChatChannel) {
        markChatMessageItemAsSeen({
          chatMessageId: lastNonUserMessage.id,
        });
      } else if (commonId) {
        markDiscussionMessageItemAsSeen({
          feedObjectId: feedItemId,
          commonId,
          lastSeenId: lastNonUserMessage.id,
          type: LastSeenEntity.DiscussionMessage,
        });
      }
    }
  }, [lastNonUserMessage?.id, commonId]);

  useEffect(() => {
    if (discussionMessageReply || currentFilesPreview) {
      focusOnChat();
    }
  }, [discussionMessageReply, currentFilesPreview]);

  useLayoutEffect(() => {
    textInputRef?.current?.clear?.();
    textInputRef?.current?.focus?.();
  }, [discussionId]);

  useEffect(() => {
    if (isFetchedDiscussionMessages) {
      onMessagesAmountChange?.(discussionMessages.length);
    }
  }, [discussionMessages.length]);

  useEffect(() => {
    const handlePaste = (event) => {
      if (event.clipboardData.files.length) {
        uploadFiles(event);
      }
    };

    chatInputWrapperRef.current?.addEventListener("paste", handlePaste);

    return () => {
      chatInputWrapperRef.current?.removeEventListener("paste", handlePaste);
    };
  }, []);

  useEffect(() => {
    const deactivateScrollingFlag = debounce(() => {
      setIsScrolling(false);
    }, 300);

    function handleScroll() {
      setIsScrolling(true);
      deactivateScrollingFlag();
    }

    chatContainerRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      chatContainerRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { y } = useScroll(chatContainerRef);
  const isScrolledToTop = Boolean(chatContainerRef.current && Math.abs(y) > 20);

  const isTopReached = useMemo(() => {
    const currentScrollPosition = Math.abs(y); // Since y can be negative
    const container = chatContainerRef.current;

    if (!container) return false;

    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    return (
      scrollHeight - clientHeight - currentScrollPosition <= SCROLL_THRESHOLD
    );
  }, [y]);

  useEffect(() => {
    if (discussionId) {
      dispatch(chatActions.clearCurrentDiscussionMessageReply());
    }
  }, [discussionId, dispatch]);

  useEffect(() => {
    if (!discussionId) {
      return;
    }

    if (!discussionMessagesData.isFirstBatchLoaded || isTopReached) {
      discussionMessagesData.fetchDiscussionMessages();
    }
  }, [isTopReached, discussionId, discussionMessagesData.isFirstBatchLoaded]);

  return (
    <div className={styles.chatWrapper}>
      <div
        className={classNames(styles.messages, {
          [styles.emptyChat]: !dateList.length,
        })}
        id={chatWrapperId}
        ref={chatContainerRef}
      >
        <ChatContentContext.Provider value={chatContentContextValue}>
          <ChatContent
            ref={chatContentRef}
            discussionMessages={discussionMessagesData.data}
            fetchReplied={discussionMessagesData.fetchRepliedMessages}
            isChatChannel={isChatChannel}
            discussionId={discussionId}
            type={type}
            commonMember={commonMember}
            governanceCircles={governanceCircles}
            chatWrapperId={chatWrapperId}
            messages={messages}
            dateList={dateList}
            lastSeenItem={lastSeenItem}
            hasPermissionToHide={hasPermissionToHide}
            users={users}
            feedItemId={feedItemId}
            isInitialLoading={!discussion || areInitialMessagesLoading}
            isLoading={areMessagesLoading}
            onMessageDelete={handleMessageDelete}
            directParent={directParent}
            onUserClick={onUserClick}
            onFeedItemClick={onFeedItemClick}
            onInternalLinkClick={onInternalLinkClick}
            isEmpty={
              discussionMessagesData.fetched &&
              !discussionMessagesData.rawData?.length && // for non direct messages chats. not using messageCount because it includes the deleted messages as well.
              Object.keys(discussionMessages).length === 0 // for direct messages chats
            }
            isMessageEditAllowed={!shouldHideChatInput}
            chatChannelId={chatChannel?.id}
          />
        </ChatContentContext.Provider>
      </div>
      {isScrolledToTop && (
        <div
          className={styles.scrollToBottomContainer}
          onClick={scrollToContainerBottom}
        >
          <ArrowInCircleIcon className={styles.scrollToBottomIcon} />
        </div>
      )}
      <MessageReply users={users} />
      <MessageLinkPreview
        message={message}
        onLinkPreviewDataChange={setLinkPreviewData}
      />
      <ChatFilePreview />
      <div
        ref={chatInputWrapperRef}
        className={classNames(styles.chatInputWrapper, {
          [styles.chatInputWrapperMultiLine]: isMultiLineInput,
        })}
      >
        <ChatInput
          ref={textInputRef}
          onClearFinished={onClearFinished}
          shouldReinitializeEditor={shouldReinitializeEditor}
          users={users}
          onEnterKeyDown={onEnterKeyDown}
          emojiCount={emojiCount}
          setMessage={setMessage}
          message={message}
          uploadFiles={uploadFiles}
          isAuthorized={isAuthorized}
          renderChatInputOuter={
            renderChatInputOuter as () => React.ReactElement
          }
          isChatChannel={isChatChannel}
          shouldHideChatInput={shouldHideChatInput}
          sendChatMessage={sendChatMessage}
          canSendMessage={Boolean(canSendMessage)}
          inputContainerRef={inputContainerRef}
          editorRef={editorRef}
        />
      </div>
    </div>
  );
}
