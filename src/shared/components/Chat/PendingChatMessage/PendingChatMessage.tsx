import React from "react";
import classNames from "classnames";
import { PendingMessage, PendingMessageStatus } from "@/shared/models";
import styles from "./PendingChatMessage.module.scss";

interface PendingChatMessageProps {
  data: PendingMessage;
}

export default function PendingChatMessage({ data }: PendingChatMessageProps) {
  return (
    <div className={styles.wrapper}>
      <div>{data.text}</div>
      <div
        className={classNames(styles.status, {
          failed: data.status === PendingMessageStatus.Failed,
        })}
      >
        {data.status === PendingMessageStatus.Sending ? "Sending..." : "Failed"}
      </div>
    </div>
  );
}
