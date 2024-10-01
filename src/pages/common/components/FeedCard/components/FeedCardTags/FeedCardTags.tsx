import React, { FC } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { selectUser } from "@/pages/Auth/store/selectors";
import { PinIcon, StarIcon } from "@/shared/icons";
import { CommonFeedType } from "@/shared/models";
import { notEmpty } from "@/shared/utils/notEmpty";
import styles from "./FeedCardTags.module.scss";

interface FeedCardTagsProps {
  unreadMessages?: number;
  type?: CommonFeedType;
  seenOnce?: boolean;
  seen?: boolean;
  ownerId?: string;
  isActive: boolean;
  isPinned?: boolean;
  isFollowing?: boolean;
  hasUnseenMention?: boolean;
}

export const MemoizedFeedCardTags: FC<FeedCardTagsProps> = (props) => {
  const {
    unreadMessages,
    type,
    seenOnce,
    seen,
    ownerId,
    isActive,
    isPinned,
    isFollowing,
    hasUnseenMention,
  } = props;
  const user = useSelector(selectUser());
  const isOwner = ownerId === user?.uid;
  const isNewTagVisible =
    notEmpty(seenOnce) && notEmpty(isOwner) && !seenOnce && !isOwner;
    const isUnseenTagVisible =
    !isNewTagVisible && !unreadMessages && notEmpty(seen) && !seen && !isOwner;
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
        <PinIcon className={classNames(styles.pin)} />
      )}
      {(unreadMessages || isUnseenTagVisible) && hasUnseenMention && (
        <div className={styles.hasUnseenMention}>@</div>
      )}
      {isFollowing && (
        <StarIcon
          className={classNames(styles.starIcon)}
          stroke="currentColor"
        />
      )}
      {isNewTagVisible && (
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
      {isUnseenTagVisible && (
        <div className={classNames(styles.tag, styles.unseen)}></div>
      )}
    </>
  );
};

export const FeedCardTags = React.memo(MemoizedFeedCardTags);