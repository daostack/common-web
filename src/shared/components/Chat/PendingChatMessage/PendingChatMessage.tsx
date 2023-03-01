import React from "react";
import { PendingMessage } from "@/shared/models";
import styles from "./PendingChatMessage.module.scss";

interface PendingChatMessageProps {
  data: PendingMessage;
}

export default function PendingChatMessage({ data }: PendingChatMessageProps) {
  return <div className={styles.messageText}>{data.text}</div>;
}
