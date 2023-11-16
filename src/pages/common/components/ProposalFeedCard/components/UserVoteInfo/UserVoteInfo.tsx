import React, { FC, ReactNode } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import avatarPlaceholderSrc from "@/shared/assets/images/avatar-placeholder.svg";
import { UserAvatar } from "@/shared/components";
import { VoteAbstain, VoteAgainst, VoteFor } from "@/shared/icons";
import { Vote, VoteOutcome } from "@/shared/models";
import { getUserName } from "@/shared/utils";
import styles from "./UserVoteInfo.module.scss";

interface UserVoteInfoProps {
  userVote?: Vote | null;
  userHasPermissionsToVote: boolean;
  isCountdownState: boolean;
}

const VOTE_OUTCOME_TO_TEXT_MAP: Record<VoteOutcome, string> = {
  [VoteOutcome.Approved]: "for",
  [VoteOutcome.Abstained]: "abstain",
  [VoteOutcome.Rejected]: "against",
};

const VOTE_OUTCOME_TO_ICON_MAP: Record<VoteOutcome, ReactNode> = {
  [VoteOutcome.Approved]: <VoteFor className={styles.icon} />,
  [VoteOutcome.Abstained]: <VoteAbstain className={styles.icon} />,
  [VoteOutcome.Rejected]: <VoteAgainst className={styles.icon} />,
};

export const UserVoteInfo: FC<UserVoteInfoProps> = (props) => {
  const { userVote, userHasPermissionsToVote, isCountdownState } = props;
  const user = useSelector(selectUser());

  if (!userVote?.outcome) {
    return userHasPermissionsToVote && !isCountdownState ? (
      <div className={styles.container}>You didn’t vote to this proposal</div>
    ) : null;
  }

  return (
    <div className={styles.container}>
      <UserAvatar
        className={styles.avatar}
        photoURL={user?.photoURL}
        userName={getUserName(user)}
        preloaderSrc={avatarPlaceholderSrc}
      />
      <span className={styles.resultText}>
        My vote is: {VOTE_OUTCOME_TO_TEXT_MAP[userVote.outcome]}
      </span>
      {VOTE_OUTCOME_TO_ICON_MAP[userVote.outcome]}
    </div>
  );
};
