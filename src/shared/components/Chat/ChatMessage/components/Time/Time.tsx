import React from "react";
import classNames from "classnames";
import { Moderation, ModerationFlags } from "@/shared/interfaces/Moderation";
import { getModerationText } from "@/shared/utils/moderation";
import styles from "./Time.module.scss";

interface TimeProps {
  createdAtDate: Date;
  editedAtDate: Date;
  moderation?: Moderation;
  isNotCurrentUserMessage: boolean;
}

export default function Time({
  createdAtDate,
  editedAtDate,
  isNotCurrentUserMessage,
  moderation,
}: TimeProps) {
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
        {moderation?.flag === ModerationFlags.Hidden &&
          getModerationText(moderation?.flag)}
      </div>
    </div>
  );
}
