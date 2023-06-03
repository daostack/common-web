import React from "react";
import classNames from "classnames";
import { ModerationFlags } from "@/shared/interfaces/Moderation";
import { DiscussionMessage } from "@/shared/models";
import { getModerationText } from "@/shared/utils/moderation";
import styles from "./Time.module.scss";

interface TimeProps {
  discussionMessage: DiscussionMessage;
  isNotCurrentUserMessage: boolean;
}

export default function Time({
  discussionMessage,
  isNotCurrentUserMessage,
}: TimeProps) {
  const createdAtDate = new Date(discussionMessage.createdAt.seconds * 1000);

  const editedAtDate = new Date(
    (discussionMessage.editedAt?.seconds ?? 0) * 1000,
  );

  const isEdited = editedAtDate > createdAtDate;

  return (
    <div className={styles.timeWrapperContainer}>
      {isEdited && (
        <div
          className={classNames(styles.timeWrapper, styles.editedTimeWrapper, {
            [styles.timeWrapperCurrentUser]: !isNotCurrentUserMessage,
          })}
        >
          (Edited{" "}
          {editedAtDate.toLocaleTimeString([], {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          })}
          )
        </div>
      )}
      <div
        className={classNames(styles.timeWrapper, styles.creationTimeWrapper, {
          [styles.timeWrapperEdited]: isEdited,
          [styles.timeWrapperCurrentUser]: !isNotCurrentUserMessage,
        })}
      >
        {createdAtDate.toLocaleTimeString([], {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        })}{" "}
        {discussionMessage.moderation?.flag === ModerationFlags.Hidden &&
          getModerationText(discussionMessage.moderation?.flag)}
      </div>
    </div>
  );
}
