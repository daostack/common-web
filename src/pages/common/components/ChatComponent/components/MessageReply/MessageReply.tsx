import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { ButtonIcon } from "@/shared/components/ButtonIcon";
import { getTextFromTextEditorString } from "@/shared/components/Chat/ChatMessage/util";
import { CommonMemberWithUserInfo } from "@/shared/models";
import CloseIcon from "@/shared/icons/close2.icon";
import {
  selectCurrentDiscussionMessageReply,
  chatActions,
} from "@/store/states";
import styles from "./MessageReply.module.scss";

interface MessageReplyProps {
  commonMembers: CommonMemberWithUserInfo[];
}

const MessageReply: React.FC<MessageReplyProps> = ({ commonMembers }) => {
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
        commonMembers,
    });

      setMessageText(parsedText);
    })();
  }, [commonMembers]);

  if (!discussionMessageReply) {
    return null;
  }

  const image = discussionMessageReply.images?.[0]?.value;

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
            <div className={styles.messageWrapper}>
              <span className={styles.username}>
                {discussionMessageReply.ownerName}
              </span>
              <p className={styles.text}>{messageText.map((text) => text)}</p>
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
