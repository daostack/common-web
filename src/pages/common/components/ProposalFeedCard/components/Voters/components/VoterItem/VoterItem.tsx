import React, { FC, ReactNode } from "react";
import classNames from "classnames";
import avatarPlaceholderSrc from "@/shared/assets/images/avatar-placeholder.svg";
import { UserAvatar } from "@/shared/components";
import { VoteAbstain, VoteAgainst, VoteFor } from "@/shared/icons";
import { DateFormat, VoteOutcome, VoteWithUserInfo } from "@/shared/models";
import { formatDate, getUserName } from "@/shared/utils";
import styles from "./VoterItem.module.scss";

interface VoterItemProps {
  className?: string;
  vote: VoteWithUserInfo;
}

const VOTE_OUTCOME_TO_ICON_MAP: Record<VoteOutcome, ReactNode> = {
  [VoteOutcome.Approved]: <VoteFor className={styles.icon} />,
  [VoteOutcome.Abstained]: <VoteAbstain className={styles.icon} />,
  [VoteOutcome.Rejected]: <VoteAgainst className={styles.icon} />,
};

const VoterItem: FC<VoterItemProps> = (props) => {
  const { className, vote } = props;
  const userName = getUserName(vote.user);
  const createdAt = new Date(vote.createdAt.seconds * 1000);

  return (
    <li className={classNames(styles.container, className)}>
      <div className={styles.content}>
        <UserAvatar
          className={styles.avatar}
          photoURL={vote.user.photoURL}
          userName={userName}
          preloaderSrc={avatarPlaceholderSrc}
        />
        <div className={styles.voteInfo}>
          <span className={styles.userName}>{userName}</span>
          <span className={styles.createdAt}>
            {formatDate(createdAt, DateFormat.LongSlashed)}
          </span>
        </div>
      </div>
      {VOTE_OUTCOME_TO_ICON_MAP[vote.outcome]}
    </li>
  );
};

export default VoterItem;
