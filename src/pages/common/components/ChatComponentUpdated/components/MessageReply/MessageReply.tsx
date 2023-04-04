import React, { useRef, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { clearCurrentDiscussionMessageReply } from "@/pages/OldCommon/store/actions";
import { selectCurrentDiscussionMessageReply } from "@/pages/OldCommon/store/selectors";
import { ButtonIcon } from "@/shared/components/ButtonIcon";
import CloseIcon from "@/shared/icons/close.icon";
import styles from "./MessageReply.module.scss";

const INPUT_BORDER_WIDTH = 2;

interface MessageReplyProps {
  inputHeight: number;
  setHeight: (value: number) => void;
}

export default function MessageReply({
  inputHeight,
  setHeight,
}: MessageReplyProps) {
  const messageReplyRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const discussionMessageReply = useSelector(
    selectCurrentDiscussionMessageReply(),
  );

  useLayoutEffect(() => {
    setHeight(messageReplyRef.current?.clientHeight || 0);
  }, [discussionMessageReply]);

  return (
    <div
      ref={messageReplyRef}
      className={classNames(styles.container, {
        [styles.containerEmpty]: !discussionMessageReply,
      })}
      style={{
        bottom: inputHeight + INPUT_BORDER_WIDTH,
      }}
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
