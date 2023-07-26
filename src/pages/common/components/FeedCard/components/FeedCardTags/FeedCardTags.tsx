import React, { FC } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { selectUser } from "@/pages/Auth/store/selectors";
import { PinIcon, StarIcon } from "@/shared/icons";
import { CommonFeedType } from "@/shared/models";
import styles from "./FeedCardTags.module.scss";

interface FeedCardTagsProps {
  unreadMessages?: number;
  type?: CommonFeedType;
  seenOnce?: boolean;
  ownerId?: string;
  isActive: boolean;
  isPinned?: boolean;
  isFollowing?: boolean;
}

export const FeedCardTags: FC<FeedCardTagsProps> = (props) => {
  const {
    unreadMessages,
    type,
    seenOnce,
    ownerId,
    isActive,
    isPinned,
    isFollowing,
  } = props;
  const user = useSelector(selectUser());
  const isOwner = ownerId === user?.uid;

  return (
    <>
      {type === CommonFeedType.Proposal && (
        <div
          className={classNames(styles.tag, styles.proposal, {
            [styles.tagActive]: isActive,
          })}
        >
          Proposal
        </div>
      )}
      {seenOnce && !unreadMessages && isPinned && (
        <PinIcon
          className={classNames(styles.pin, {
            [styles.pinActive]: isActive,
          })}
        />
      )}
      {isFollowing && (
        <StarIcon className={styles.starIcon} stroke="currentColor" />
      )}
      {!seenOnce && !isOwner && (
        <div
          className={classNames(styles.tag, styles.new, {
            [styles.tagActive]: isActive,
          })}
        >
          New
        </div>
      )}
      {Boolean(unreadMessages) && seenOnce && (
        <div
          className={classNames(styles.tag, styles.unreadMessages, {
            [styles.unreadMessagesLong]: Number(unreadMessages) > 9,
            [styles.tagActive]: isActive,
          })}
        >
          {unreadMessages}
        </div>
      )}
    </>
  );
};
