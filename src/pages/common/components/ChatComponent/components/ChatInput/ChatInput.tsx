import React, {
  ChangeEvent,
  forwardRef,
  MutableRefObject,
  ReactElement,
  RefCallback,
} from "react";
import classNames from "classnames";
import { FILES_ACCEPTED_EXTENSIONS } from "@/shared/constants";
import { PlusIcon, SendIcon } from "@/shared/icons";
import { User } from "@/shared/models";
import {
  BaseTextEditor,
  ButtonIcon,
  checkIsTextEditorValueEmpty,
  TextEditorSize,
  TextEditorValue,
} from "@/shared/ui-kit";
import { EmojiCount } from "@/shared/ui-kit/TextEditor/utils";
import { emptyFunction } from "@/shared/utils";
import styles from "./ChatInput.module.scss";
import { BaseTextEditorHandles } from "@/shared/ui-kit/TextEditor/BaseTextEditor";

interface ChatInputProps {
  shouldHideChatInput: boolean;
  isChatChannel: boolean;
  uploadFiles: (event: ChangeEvent<HTMLInputElement> | ClipboardEvent) => void;
  message: TextEditorValue;
  setMessage: React.Dispatch<React.SetStateAction<TextEditorValue>>;
  emojiCount: EmojiCount;
  onEnterKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
  users: User[];
  shouldReinitializeEditor: boolean;
  onClearFinished: () => void;
  canSendMessage?: boolean;
  sendChatMessage: () => void;
  inputContainerRef?:
  | MutableRefObject<HTMLDivElement | null>
  | RefCallback<HTMLDivElement>;
  editorRef?: MutableRefObject<HTMLElement | null> | RefCallback<HTMLElement>;
  renderChatInputOuter?: () => ReactElement;
  isAuthorized?: boolean;
}

export const ChatInput = React.memo(forwardRef<BaseTextEditorHandles, ChatInputProps>((props, ref): ReactElement | null => {
  const {
    inputContainerRef,
    editorRef,
    canSendMessage,
    sendChatMessage,
    shouldHideChatInput,
    isChatChannel,
    renderChatInputOuter,
    isAuthorized,
    uploadFiles,
    message,
    setMessage,
    emojiCount,
    onEnterKeyDown,
    users,
    shouldReinitializeEditor,
    onClearFinished,
  } = props;

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
        ref={ref}
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
        value={message}
        onChange={setMessage}
        placeholder="Message"
        onKeyDown={onEnterKeyDown}
        users={users}
        shouldReinitializeEditor={shouldReinitializeEditor}
        onClearFinished={onClearFinished}
        scrollSelectionIntoView={emptyFunction}
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
}));
