import React, { ReactNode } from "react";
import classNames from "classnames";
import { VoteAbstain, VoteAgainst, VoteFor } from "@/shared/icons";
import { VoteOutcome } from "@/shared/models";
import { Button } from "@/shared/ui-kit";
import styles from "./VoteButton.module.scss";

interface VoteButtonProps {
  voteOutcome: VoteOutcome;
}

const VOTE_OUTCOME_TO_TEXT_MAP: Record<VoteOutcome, string> = {
  [VoteOutcome.Approved]: "Vote for",
  [VoteOutcome.Abstained]: "Abstain",
  [VoteOutcome.Rejected]: "Vote against",
};

const VOTE_OUTCOME_TO_ICON_MAP: Record<VoteOutcome, ReactNode> = {
  [VoteOutcome.Approved]: <VoteFor />,
  [VoteOutcome.Abstained]: <VoteAbstain />,
  [VoteOutcome.Rejected]: <VoteAgainst />,
};

export const VoteButton: React.FC<VoteButtonProps> = (props) => {
  const { voteOutcome } = props;

  return (
    <Button
      className={classNames(styles.button, {
        [styles.approveButton]: VoteOutcome.Approved === voteOutcome,
        [styles.abstainButton]: VoteOutcome.Abstained === voteOutcome,
        [styles.rejectButton]: VoteOutcome.Rejected === voteOutcome,
      })}
    >
      <p
        className={classNames(styles.buttonText, {
          [styles.approveText]: VoteOutcome.Approved === voteOutcome,
          [styles.abstainText]: VoteOutcome.Abstained === voteOutcome,
          [styles.rejectText]: VoteOutcome.Rejected === voteOutcome,
        })}
      >
        {VOTE_OUTCOME_TO_TEXT_MAP[voteOutcome]}
      </p>
      {VOTE_OUTCOME_TO_ICON_MAP[voteOutcome]}
    </Button>
  );
};
