import React, { FC, ReactNode } from "react";
import classNames from "classnames";
import avatarPlaceholderSrc from "@/shared/assets/images/avatar-placeholder.svg";
import { UserAvatar } from "@/shared/components";
import { VoteAbstain, VoteAgainst, VoteFor } from "@/shared/icons";
import {
  DateFormat,
  EligibleVoterWithUserInfo,
  VoteOutcome,
} from "@/shared/models";
import { formatDate, getUserName } from "@/shared/utils";
import styles from "./VoterItem.module.scss";

interface VoterItemProps {
  className?: string;
  voter: EligibleVoterWithUserInfo;
}

const VOTE_OUTCOME_TO_ICON_MAP: Record<VoteOutcome, ReactNode> = {
  [VoteOutcome.Approved]: <VoteFor className={styles.icon} />,
  [VoteOutcome.Abstained]: <VoteAbstain className={styles.icon} />,
  [VoteOutcome.Rejected]: <VoteAgainst className={styles.icon} />,
};

const VoterItem: FC<VoterItemProps> = (props) => {
  const { className, voter } = props;
  const userName = getUserName(voter.user);

  return (
    <li className={classNames(styles.container, className)}>
      <div className={styles.content}>
        <UserAvatar
          className={styles.avatar}
          photoURL={voter.user?.photoURL}
          userName={userName}
          preloaderSrc={avatarPlaceholderSrc}
        />
        <div className={styles.voteInfo}>
          <span className={styles.userName}>{userName}</span>
          <span className={styles.createdAt}>
            {voter.vote
              ? formatDate(
                  new Date(voter.vote.createdAt.seconds * 1000),
                  DateFormat.LongSlashed,
                )
              : "No vote"}
          </span>
        </div>
      </div>
      {voter.vote && VOTE_OUTCOME_TO_ICON_MAP[voter.vote.outcome]}
    </li>
  );
};

export default VoterItem;
