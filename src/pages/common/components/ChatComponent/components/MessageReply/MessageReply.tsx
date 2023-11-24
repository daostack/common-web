import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { ButtonIcon } from "@/shared/components/ButtonIcon";
import { getTextFromTextEditorString } from "@/shared/components/Chat/ChatMessage/utils";
import CloseIcon from "@/shared/icons/close2.icon";
import { User } from "@/shared/models";
import { FilePreview, FilePreviewVariant, getFileName } from "@/shared/ui-kit";
import { convertBytes } from "@/shared/utils/convertBytes";
import {
  selectCurrentDiscussionMessageReply,
  chatActions,
} from "@/store/states";
import styles from "./MessageReply.module.scss";

interface MessageReplyProps {
  users: User[];
}

const FILE_NAME_LIMIT = 21;

const MessageReply: React.FC<MessageReplyProps> = ({ users }) => {
  const dispatch = useDispatch();
  const discussionMessageReply = useSelector(
    selectCurrentDiscussionMessageReply(),
  );

  const [messageText, setMessageText] = useState<(string | JSX.Element)[]>([]);

  useEffect(() => {
    if (!discussionMessageReply?.text) {
      return;
    }

    (async () => {
      const parsedText = await getTextFromTextEditorString({
        textEditorString: discussionMessageReply.text,
        users,
      });

      setMessageText(parsedText);
    })();
  }, [users, discussionMessageReply]);

  if (!discussionMessageReply) {
    return null;
  }

  const image = discussionMessageReply.images?.[0]?.value;
  const file = discussionMessageReply.files?.[0];

  return (
    <div
      className={classNames(styles.container, {
        [styles.containerEmpty]: !discussionMessageReply,
      })}
    >
      {discussionMessageReply && (
        <>
          <div className={styles.messageContainer}>
            {image && <img className={styles.image} src={image} />}
            {file && (
              <FilePreview
                containerClassName={styles.fileContainer}
                name={file.name ?? file.title}
                src={file.value}
                isPreview
                size={24}
                variant={FilePreviewVariant.extraSmall}
              />
            )}
            <div className={styles.messageWrapper}>
              <span className={styles.username}>
                {discussionMessageReply.ownerName}
              </span>

              {file ? (
                <>
                  <p className={styles.text}>
                    {getFileName(file.name ?? file.title, FILE_NAME_LIMIT)}
                  </p>
                  {file.size && (
                    <p className={styles.fileSize}>{convertBytes(file.size)}</p>
                  )}
                </>
              ) : (
                <p className={styles.text}>{messageText.map((text) => text)}</p>
              )}
            </div>
          </div>
          <ButtonIcon
            className={styles.closeButton}
            onClick={() => {
              dispatch(chatActions.clearCurrentDiscussionMessageReply());
            }}
          >
            <CloseIcon height={12} width={12} />
          </ButtonIcon>
        </>
      )}
    </div>
  );
};

export default MessageReply;
