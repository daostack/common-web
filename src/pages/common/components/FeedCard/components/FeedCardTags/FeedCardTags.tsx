import React, { FC } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { selectUser } from "@/pages/Auth/store/selectors";
import { CommonFeedType } from "@/shared/models";
import styles from "./FeedCardTags.module.scss";

interface FeedCardTagsProps {
  unreadMessages?: number;
  type?: CommonFeedType;
  seenOnce?: boolean;
  ownerId?: string;
}

export const FeedCardTags: FC<FeedCardTagsProps> = (props) => {
  const { unreadMessages, type, seenOnce, ownerId } = props;
  const user = useSelector(selectUser());
  const isOwner = ownerId === user?.uid;

  return (
    <>
      {type === CommonFeedType.Proposal && (
        <div className={classNames(styles.tag, styles.proposal)}>Proposal</div>
      )}
      {!seenOnce && !isOwner && (
        <div className={classNames(styles.tag, styles.new)}>New</div>
      )}
      {Boolean(unreadMessages) && seenOnce && (
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
