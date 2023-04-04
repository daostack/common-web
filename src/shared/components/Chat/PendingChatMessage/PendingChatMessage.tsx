import React from "react";
import classNames from "classnames";
import { PendingMessage, PendingMessageStatus } from "@/shared/models";
import styles from "./PendingChatMessage.module.scss";

interface PendingChatMessageProps {
  data: PendingMessage;
}

export default function PendingChatMessage({ data }: PendingChatMessageProps) {
  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.failed]: data.status === PendingMessageStatus.Failed,
      })}
    >
      <div className={styles.content}>{data.text}</div>
      <div className={styles.status}>
        {data.status === PendingMessageStatus.Failed && "Failed"}
      </div>
    </div>
  );
}
