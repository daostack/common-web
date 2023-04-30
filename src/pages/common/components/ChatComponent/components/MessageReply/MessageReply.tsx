import React from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { ButtonIcon } from "@/shared/components/ButtonIcon";
import CloseIcon from "@/shared/icons/close2.icon";
import {
  selectCurrentDiscussionMessageReply,
  chatActions,
} from "@/store/states";
import styles from "./MessageReply.module.scss";

export default function MessageReply() {
  const dispatch = useDispatch();
  const discussionMessageReply = useSelector(
    selectCurrentDiscussionMessageReply(),
  );

  if (!discussionMessageReply) {
    return null;
  }

  const image = discussionMessageReply.images?.[0].value;

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
              <p className={styles.text}>{discussionMessageReply.text}</p>
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
}
