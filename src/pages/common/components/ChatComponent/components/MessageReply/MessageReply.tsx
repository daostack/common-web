import React from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { clearCurrentDiscussionMessageReply } from "@/pages/OldCommon/store/actions";
import { selectCurrentDiscussionMessageReply } from "@/pages/OldCommon/store/selectors";
import { ButtonIcon } from "@/shared/components/ButtonIcon";
import CloseIcon from "@/shared/icons/close.icon";
import styles from "./MessageReply.module.scss";

export default function MessageReply() {
  const dispatch = useDispatch();
  const discussionMessageReply = useSelector(
    selectCurrentDiscussionMessageReply(),
  );

  if (!discussionMessageReply) {
    return null;
  }

  return (
    <div
      className={classNames(styles.container, {
        [styles.containerEmpty]: !discussionMessageReply,
      })}
    >
      {discussionMessageReply && (
        <>
          <div className={styles.messageWrapper}>
            <span className={styles.username}>
              {discussionMessageReply.ownerName}
            </span>
            <p className={styles.text}>{discussionMessageReply.text}</p>
          </div>
          <ButtonIcon
            className={styles.closeButton}
            onClick={() => {
              dispatch(clearCurrentDiscussionMessageReply());
            }}
          >
            <CloseIcon fill="#001A36" height={16} width={16} />
          </ButtonIcon>
        </>
      )}
    </div>
  );
}
