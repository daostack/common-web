import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  ChangeEvent,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "react-use";
import classNames from "classnames";
import isHotkey from "is-hotkey";
import { delay, omit } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useCommonMembers } from "@/pages/OldCommon/hooks";
import { DiscussionMessageService, FileService } from "@/services";
import { Loader } from "@/shared/components";
import {
  ChatType,
  GovernanceActions,
  LastSeenEntity,
} from "@/shared/constants";
import { HotKeys } from "@/shared/constants/keyboardKeys";
import {
  useDiscussionMessagesById,
  useMarkFeedItemAsSeen,
} from "@/shared/hooks/useCases";
import { SendIcon } from "@/shared/icons";
import { CreateDiscussionMessageDto } from "@/shared/interfaces/api/discussionMessages";
import {
  Circles,
  CommonFeedObjectUserUnique,
  CommonMember,
  Discussion,
  DiscussionMessage,
  Timestamp,
} from "@/shared/models";
import {
  BaseTextEditor,
  TextEditorValue,
  parseStringToTextEditorValue,
  ButtonIcon,
} from "@/shared/ui-kit";
import { getMentionTags } from "@/shared/ui-kit/TextEditor/utils";
import { getUserName, hasPermission } from "@/shared/utils";
import {
  cacheActions,
  chatActions,
  selectCurrentDiscussionMessageReply,
  selectFilesPreview,
  FileInfo,
} from "@/store/states";
import { ChatContent, MessageReply, ChatFilePreview } from "./components";
import { getLastNonUserMessage } from "./utils";
import styles from "./ChatComponent.module.scss";

const ACCEPTED_EXTENSIONS = ".jpg, jpeg, .png";

interface ChatComponentInterface {
  commonId: string;
  type: ChatType;
  isCommonMemberFetched: boolean;
  governanceCircles?: Circles;
  commonMember: CommonMember | null;
  hasAccess?: boolean;
  discussion: Discussion;
  lastSeenItem?: CommonFeedObjectUserUnique["lastSeen"];
  seenOnce?: CommonFeedObjectUserUnique["seenOnce"];
  feedItemId: string;
  isAuthorized?: boolean;
  isHidden: boolean;
}

interface Messages {
  [key: number]: DiscussionMessage[];
}

type CreateDiscussionMessageDtoWithFilesPreview = CreateDiscussionMessageDto & {
  filesPreview?: FileInfo[] | null;
  imagesPreview?: FileInfo[] | null;
};

function groupday(acc: any, currentValue: DiscussionMessage): Messages {
  const d = new Date(currentValue.createdAt.seconds * 1000);
  const i = Math.floor(d.getTime() / (1000 * 60 * 60 * 24));
  const timestamp = i * (1000 * 60 * 60 * 24);
  acc[timestamp] = acc[timestamp] || [];
  acc[timestamp].push(currentValue);
  return acc;
}

const CHAT_HOT_KEYS = [HotKeys.Enter, HotKeys.ModEnter, HotKeys.ShiftEnter];

export default function ChatComponent({
  commonId,
  type,
  governanceCircles,
  commonMember,
  discussion,
  hasAccess = true,
  lastSeenItem,
  seenOnce,
  feedItemId,
  isAuthorized,
  isHidden = false,
  isCommonMemberFetched,
}: ChatComponentInterface) {
  const dispatch = useDispatch();
  const discussionMessageReply = useSelector(
    selectCurrentDiscussionMessageReply(),
  );
  const currentFilesPreview = useSelector(selectFilesPreview());
  const chatWrapperId = useMemo(() => `chat-wrapper-${uuidv4()}`, []);
  const { markFeedItemAsSeen } = useMarkFeedItemAsSeen();

  const { data: commonMembers, fetchCommonMembers } = useCommonMembers();

  const [message, setMessage] = useState<TextEditorValue>(
    parseStringToTextEditorValue(),
  );
  const [shouldReinitializeEditor, setShouldReinitializeEditor] =
    useState(false);
  const onClear = () => {
    setShouldReinitializeEditor(true);
    setMessage(parseStringToTextEditorValue());
  };

  const users = useMemo(() => {
    return commonMembers
      .filter((member) => member.userId !== commonMember?.userId)
      .map(({ user }) => user);
  }, [commonMember, commonMembers]);

  useEffect(() => {
    if (commonId) {
      fetchCommonMembers(commonId, discussion.circleVisibility);
    }
  }, [commonId, discussion.circleVisibility]);

  const hasPermissionToHide =
    commonMember && governanceCircles
      ? hasPermission({
          commonMember,
          governance: {
            circles: governanceCircles,
          },
          key: GovernanceActions.HIDE_OR_UNHIDE_MESSAGE,
        })
      : false;
  const {
    fetchDiscussionMessages,
    data: discussionMessages = [],
    fetched: isFetchedDiscussionMessages,
    addDiscussionMessage,
  } = useDiscussionMessagesById({
    hasPermissionToHide,
  });
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const discussionId = discussion.id;

  const lastNonUserMessage = getLastNonUserMessage(
    discussionMessages || [],
    userId,
  );

  const messages = (discussionMessages ?? []).reduce(groupday, {});
  const dateList = useMemo(() => Object.keys(messages), [messages]);

  useEffect(() => {
    if (discussionId) {
      fetchDiscussionMessages(discussionId);
    }
  }, [discussionId]);

  const [newMessages, setMessages] = useState<
    CreateDiscussionMessageDtoWithFilesPreview[]
  >([]);

  const canSendMessage = message.length || currentFilesPreview?.length;

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
          const response = await DiscussionMessageService.createMessage(
            payload,
          );

          dispatch(
            cacheActions.updateDiscussionMessageWithActualId({
              discussionId,
              pendingMessageId: payload.pendingMessageId as string,
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

  const uploadFiles = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      chatActions.setFilesPreview(
        Array.from(event.target.files || []).map((file) => {
          return {
            info: file,
            src: URL.createObjectURL(file),
          };
        }),
      ),
    );
  };

  const sendMessage = useCallback(
    async (message: TextEditorValue) => {
      if (user && user.uid && commonId) {
        const pendingMessageId = uuidv4();

        const mentionTags = getMentionTags(message).map((tag) => ({
          value: tag.userId,
        }));
        const imagesPreview = FileService.getImageTypeFromFiles(
          currentFilesPreview ?? [],
        );
        const filesPreview = FileService.getExcludeImageTypeFromFiles(
          currentFilesPreview ?? [],
        );

        const payload: CreateDiscussionMessageDtoWithFilesPreview = {
          pendingMessageId,
          text: JSON.stringify(message),
          ownerId: user.uid,
          commonId,
          discussionId,
          ...(discussionMessageReply && {
            parentId: discussionMessageReply?.id,
          }),
          filesPreview,
          imagesPreview,
          tags: mentionTags,
        };
        const firebaseDate = Timestamp.fromDate(new Date());

        const msg = {
          id: pendingMessageId,
          owner: user,
          ownerAvatar: (user.photo || user.photoURL) as string,
          ownerId: userId as string,
          ownerName: getUserName(user),
          text: JSON.stringify(message),
          commonId,
          discussionId,
          createdAt: firebaseDate,
          updatedAt: firebaseDate,
          parentMessage: discussionMessageReply?.id
            ? {
                id: discussionMessageReply?.id,
                ownerName: discussionMessageReply.ownerName,
                ownerId: discussionMessageReply.ownerId,
                text: discussionMessageReply.text,
              }
            : null,
          images: imagesPreview?.map((file) =>
            FileService.convertFileInfoToCommonLink(file),
          ),
          files: filesPreview?.map((file) =>
            FileService.convertFileInfoToCommonLink(file),
          ),
          tags: mentionTags,
        };

        setMessages((prev) => [...prev, payload]);
        addDiscussionMessage(discussionId, msg);

        if (discussionMessageReply) {
          dispatch(chatActions.clearCurrentDiscussionMessageReply());
        }
        if (currentFilesPreview) {
          dispatch(chatActions.clearFilesPreview());
        }
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
    ],
  );

  const onClearFinished = () => {
    setShouldReinitializeEditor(false);
  };

  const sendChatMessage = (): void => {
    if (canSendMessage) {
      sendMessage && sendMessage(message);
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

    if (enteredHotkey === HotKeys.Enter) {
      sendChatMessage();
      return;
    }
  };

  useEffect(() => {
    if (
      isFetchedDiscussionMessages &&
      discussionMessages?.length === 0 &&
      !seenOnce
    ) {
      markFeedItemAsSeen({
        feedObjectId: feedItemId,
        commonId,
      });
    }
  }, [
    isFetchedDiscussionMessages,
    discussionMessages?.length,
    feedItemId,
    commonId,
  ]);

  useEffect(() => {
    if (
      lastNonUserMessage &&
      lastSeenItem?.id !== lastNonUserMessage.id &&
      feedItemId
    ) {
      markFeedItemAsSeen({
        feedObjectId: feedItemId,
        commonId: lastNonUserMessage.commonId,
        lastSeenId: lastNonUserMessage.id,
        type: LastSeenEntity.DiscussionMessage,
      });
    }
  }, [lastNonUserMessage?.id]);

  const editorRef = useRef(null);

  return (
    <div className={styles.chatWrapper}>
      <div
        className={classNames(styles.messages, {
          [styles.emptyChat]: !dateList.length,
        })}
        id={chatWrapperId}
      >
        {isFetchedDiscussionMessages ? (
          <ChatContent
            type={type}
            commonMember={commonMember}
            isCommonMemberFetched={isCommonMemberFetched}
            isJoiningPending={false}
            hasAccess={hasAccess}
            isHidden={false}
            chatWrapperId={chatWrapperId}
            messages={messages}
            dateList={dateList}
            lastSeenItem={lastSeenItem}
            hasPermissionToHide={hasPermissionToHide}
            commonMembers={commonMembers}
            discussionId={discussionId}

          />
        ) : (
          <div className={styles.loaderContainer}>
            <Loader />
          </div>
        )}
      </div>
      {isAuthorized && (
        <div className={styles.bottomChatContainer}>
          <MessageReply commonMembers={commonMembers} />
          <ChatFilePreview />
          <div className={styles.chatInputWrapper}>
            {!commonMember || !hasAccess || isHidden ? (
              <span className={styles.permissionsText}>
                Only members can send messages
              </span>
            ) : (
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
                  accept={ACCEPTED_EXTENSIONS}
                />
                <BaseTextEditor
                  editorRef={editorRef}
                  className={styles.messageInput}
                  value={message}
                  onChange={setMessage}
                  placeholder="What do you think?"
                  onKeyDown={onEnterKeyDown}
                  users={users}
                  shouldReinitializeEditor={shouldReinitializeEditor}
                  onClearFinished={onClearFinished}
                />
                <button
                  className={styles.sendIcon}
                  onClick={sendChatMessage}
                  disabled={!canSendMessage}
                >
                  <SendIcon />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
