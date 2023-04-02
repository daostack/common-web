import React from "react";
import { FC } from "react";
import classNames from "classnames";
import { CommonFeedType } from "@/shared/models";
import styles from "./FeedCardTags.module.scss";

interface FeedCardTagsProps {
  unreadMessages: number | undefined;
  type: CommonFeedType | undefined;
}

export const FeedCardTags: FC<FeedCardTagsProps> = (props) => {
  const { unreadMessages, type } = props;

  return (
    <>
      {type === CommonFeedType.Proposal && (
        <div className={classNames(styles.tag, styles.proposal)}>Proposal</div>
      )}
      {Boolean(unreadMessages) && (
        <div
          className={classNames(styles.tag, styles.unreadMessages, {
            [styles.unreadMessagesLong]: Number(unreadMessages) > 9,
          })}
        >
          {unreadMessages}
        </div>
      )}
    </>
  );
};
