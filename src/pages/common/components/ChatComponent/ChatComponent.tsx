import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  ChangeEvent,
  useRef,
  ReactNode,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce, useMeasure, useScroll } from "react-use";
import classNames from "classnames";
import isHotkey from "is-hotkey";
import { debounce, delay, omit } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { selectUser } from "@/pages/Auth/store/selectors";
import { ChatService, DiscussionMessageService, FileService } from "@/services";
import { InternalLinkData } from "@/shared/components";
import {
  ChatType,
  DiscussionMessageOwnerType,
  GovernanceActions,
  LastSeenEntity,
} from "@/shared/constants";
import { FILES_ACCEPTED_EXTENSIONS } from "@/shared/constants";
import { HotKeys } from "@/shared/constants/keyboardKeys";
import { ChatMessageToUserDiscussionMessageConverter } from "@/shared/converters";
import { useZoomDisabling, useImageSizeCheck } from "@/shared/hooks";
import { PlusIcon, SendIcon } from "@/shared/icons";
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
  BaseTextEditor,
  TextEditorValue,
  getMentionTags,
  parseStringToTextEditorValue,
  ButtonIcon,
  checkIsTextEditorValueEmpty,
  TextEditorSize,
  removeTextEditorEmptyEndLinesValues,
  countTextEditorEmojiElements,
} from "@/shared/ui-kit";
import {
  emptyFunction,
  getUserName,
  hasPermission,
  isMobile,
} from "@/shared/utils";
import {
  cacheActions,
  chatActions,
  selectCurrentDiscussionMessageReply,
  selectFilesPreview,
  FileInfo,
} from "@/store/states";
import { ChatContentContext, ChatContentData } from "../CommonContent/context";
import {
  ChatContent,
  ChatContentRef,
  MessageReply,
  ChatFilePreview,
} from "./components";
import { useChatChannelChatAdapter, useDiscussionChatAdapter } from "./hooks";
import { getLastNonUserMessage } from "./utils";
import styles from "./ChatComponent.module.scss";

const BASE_CHAT_INPUT_HEIGHT = 48;

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
  onMessagesAmountChange,
  directParent,
  renderChatInput: renderChatInputOuter,
  onUserClick,
  onFeedItemClick,
  onInternalLinkClick,
}: ChatComponentInterface) {
  const dispatch = useDispatch();
  const { checkImageSize } = useImageSizeCheck();
  useZoomDisabling();
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
  });
  const {
    chatMessagesData,
    markChatMessageItemAsSeen,
    chatUsers,
    fetchChatUsers,
  } = useChatChannelChatAdapter({ participants: chatChannel?.participants });
  const users = chatChannel ? chatUsers : discussionUsers;
  const discussionMessages = chatChannel
    ? chatMessagesData.data
    : discussionMessagesData.data || [];
  const isFetchedDiscussionMessages =
    discussionMessagesData.fetched || chatMessagesData.fetched;
  const isLoadingDiscussionMessages =
    discussionMessagesData.loading || chatMessagesData.loading;
  const currentFilesPreview = useSelector(selectFilesPreview());
  const chatContentRef = useRef<ChatContentRef>(null);
  const chatWrapperId = useMemo(() => `chat-wrapper-${uuidv4()}`, []);
  const chatInputWrapperRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const chatContentContextValue: ChatContentData = useMemo(
    () => ({
      isScrolling,
      chatContentRect: chatContainerRef.current?.getBoundingClientRect(),
    }),
    [isScrolling, chatContainerRef.current],
  );

  const [message, setMessage] = useState<TextEditorValue>(
    parseStringToTextEditorValue(),
  );

  const initialMessage = parseStringToTextEditorValue();

  const emojiCount = useMemo(
    () => countTextEditorEmojiElements(message),
    [message],
  );
  const [shouldReinitializeEditor, setShouldReinitializeEditor] =
    useState(false);
  const onClear = () => {
    setShouldReinitializeEditor(true);
    setMessage(parseStringToTextEditorValue());
  };

  const [isMultiLineInput, setIsMultiLineInput] = useState(false);

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
  const dateList = useMemo(() => Object.keys(messages), [messages]);

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
      const newMessagesWithFiles = await Promise.all(
        newMessages.map(async (payload) => {
          const [uploadedFiles, uploadedImages] = await Promise.all([
            FileService.uploadFiles(
              (payload.filesPreview ?? []).map((file) =>
                FileService.convertFileInfoToUploadFile(file),
              ),
            ),
            FileService.uploadFiles(
              (payload.imagesPreview ?? []).map((file) =>
                FileService.convertFileInfoToUploadFile(file),
              ),
            ),
          ]);

          const updatedPayload = omit(payload, [
            "filesPreview",
            "imagesPreview",
          ]);

          return {
            ...updatedPayload,
            images: uploadedImages,
            files: uploadedFiles,
          };
        }),
      );

      newMessagesWithFiles.map(async (payload, index) => {
        delay(async () => {
          const pendingMessageId = payload.pendingMessageId as string;

          if (chatChannel) {
            const response = await ChatService.sendChatMessage({
              id: pendingMessageId,
              chatChannelId: chatChannel.id,
              text: payload.text || "",
              images: payload.images,
              files: payload.files,
              mentions: payload.tags?.map((tag) => tag.value),
              parentId: payload.parentId,
            });
            chatMessagesData.updateChatMessage(response);

            return;
          }

          const response = await DiscussionMessageService.createMessage({
            ...payload,
            id: pendingMessageId,
          });

          dispatch(
            cacheActions.updateDiscussionMessageWithActualId({
              discussionId,
              pendingMessageId,
              actualId: response.id,
            }),
          );
        }, 2000 * index);
        return payload;
      });

      if (newMessages.length > 0) {
        setMessages([]);
      }
    },
    1500,
    [newMessages, discussionId, dispatch],
  );

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
        [...(currentFilesPreview ?? []), ...newFilesPreview].slice(0, 10),
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
          });
        }

        setMessages((prev) => {
          if (isFilesMessageWithoutTextAndImages) {
            return [...prev, ...filePreviewPayload];
          }

          return [...prev, ...filePreviewPayload, payload];
        });

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
            discussionMessagesData.addDiscussionMessage(pendingMessage);
          });
        }

        if (discussionMessageReply) {
          dispatch(chatActions.clearCurrentDiscussionMessageReply());
        }
        if (currentFilesPreview) {
          dispatch(chatActions.clearFilesPreview());
        }
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
    ],
  );

  const onClearFinished = () => {
    setShouldReinitializeEditor(false);
  };

  const sendChatMessage = (): void => {
    if (canSendMessage) {
      sendMessage && sendMessage(message);
      chatContentRef.current?.scrollToContainerBottom();
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
    if (isChatChannel) {
      markChatMessageItemAsSeen({
        chatChannelId: feedItemId,
      });
    } else if (commonId) {
      markDiscussionMessageItemAsSeen({
        feedObjectId: feedItemId,
        commonId,
      });
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
      } else {
        markDiscussionMessageItemAsSeen({
          feedObjectId: feedItemId,
          commonId: lastNonUserMessage.commonId,
          lastSeenId: lastNonUserMessage.id,
          type: LastSeenEntity.DiscussionMessage,
        });
      }
    }
  }, [lastNonUserMessage?.id]);

  useEffect(() => {
    if (discussionMessageReply || currentFilesPreview) {
      focusOnChat();
    }
  }, [discussionMessageReply, currentFilesPreview]);

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

  const renderChatInput = (): ReactNode => {
    const shouldHideChatInput = !isChatChannel && (!hasAccess || isHidden);

    if (shouldHideChatInput) {
      return null;
    }
    if (!isChatChannel) {
      const chatInputEl = renderChatInputOuter?.();

      if (chatInputEl || chatInputEl === null) {
        return chatInputEl;
      }
    }
    if (!isAuthorized) {
      return null;
    }

    return (
      <>
        <ButtonIcon
          className={styles.addFilesIcon}
          onClick={() => {
            document.getElementById("file")?.click();
          }}
        >
          <PlusIcon />
        </ButtonIcon>
        <input
          id="file"
          type="file"
          onChange={uploadFiles}
          style={{ display: "none" }}
          multiple
          accept={FILES_ACCEPTED_EXTENSIONS}
        />
        <BaseTextEditor
          inputContainerRef={inputContainerRef}
          size={TextEditorSize.Auto}
          editorRef={editorRef}
          className={classNames(styles.messageInput, {
            [styles.messageInputEmpty]: checkIsTextEditorValueEmpty(message),
          })}
          classNameRtl={styles.messageInputRtl}
          elementStyles={{
            emoji: classNames({
              [styles.singleEmojiText]: emojiCount.isSingleEmoji,
              [styles.multipleEmojiText]: emojiCount.isMultipleEmoji,
            }),
          }}
          value={initialMessage}
          onChange={setMessage}
          placeholder="Message"
          onKeyDown={onEnterKeyDown}
          users={users}
          shouldReinitializeEditor={shouldReinitializeEditor}
          onClearFinished={onClearFinished}
          scrollSelectionIntoView={emptyFunction}
          groupChat={chatChannel && chatChannel?.participants.length > 2}
        />
        <button
          className={styles.sendIcon}
          onClick={sendChatMessage}
          disabled={!canSendMessage}
        >
          <SendIcon />
        </button>
      </>
    );
  };

  const { y } = useScroll(chatContainerRef);

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
      discussionMessagesData.fetchDiscussionMessages();
      dispatch(chatActions.clearCurrentDiscussionMessageReply());
    }
  }, [discussionId, dispatch]);

  useEffect(() => {
    if (isTopReached && discussionId) {
      discussionMessagesData.fetchDiscussionMessages();
    }
  }, [isTopReached, discussionId]);

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
            isLoading={!discussion || isLoadingDiscussionMessages}
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
          />
        </ChatContentContext.Provider>
      </div>
      <div className={styles.bottomChatContainer}>
        <MessageReply users={users} />
        <ChatFilePreview />
        <div
          ref={chatInputWrapperRef}
          className={classNames(styles.chatInputWrapper, {
            [styles.chatInputWrapperMultiLine]: isMultiLineInput,
          })}
        >
          {renderChatInput()}
        </div>
      </div>
    </div>
  );
}
