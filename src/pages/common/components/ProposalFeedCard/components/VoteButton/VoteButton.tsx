import React, { ReactNode } from "react";
import classNames from "classnames";
import { VoteAbstain, VoteAgainst, VoteFor } from "@/shared/icons";
import { ResolutionType, VoteOutcome } from "@/shared/models";
import { Button } from "@/shared/ui-kit";
import styles from "./VoteButton.module.scss";

interface VoteButtonProps {
  className?: string;
  voteOutcome: VoteOutcome;
  onClick?: (voteOutcome: VoteOutcome) => void;
  resolutionType?: ResolutionType;
}

const VOTE_OUTCOME_TO_ICON_MAP: Record<VoteOutcome, ReactNode> = {
  [VoteOutcome.Approved]: <VoteFor className={styles.icon} />,
  [VoteOutcome.Abstained]: <VoteAbstain className={styles.icon} />,
  [VoteOutcome.Rejected]: <VoteAgainst className={styles.icon} />,
};

const getVoteOutcomeText = (
  voteOutcome: VoteOutcome,
  resolutionType?: ResolutionType,
): string => {
  switch (voteOutcome) {
    case VoteOutcome.Approved:
      return resolutionType === ResolutionType.IMMEDIATE
        ? "Approve"
        : "Vote for";
    case VoteOutcome.Rejected:
      return resolutionType === ResolutionType.IMMEDIATE
        ? "Reject"
        : "Vote against";
    case VoteOutcome.Abstained:
      return "Abstain";
    default:
      return "";
  }
};

export const VoteButton: React.FC<VoteButtonProps> = (props) => {
  const { className, voteOutcome, onClick, resolutionType } = props;

  const handleClick = (event) => {
    event.stopPropagation();
    if (onClick) {
      onClick(voteOutcome);
    }
  };

  return (
    <Button
      className={classNames(
        styles.button,
        {
          [styles.approveButton]: VoteOutcome.Approved === voteOutcome,
          [styles.abstainButton]: VoteOutcome.Abstained === voteOutcome,
          [styles.rejectButton]: VoteOutcome.Rejected === voteOutcome,
        },
        className,
      )}
      onClick={handleClick}
    >
      <p
        className={classNames(styles.buttonText, {
          [styles.approveText]: VoteOutcome.Approved === voteOutcome,
          [styles.abstainText]: VoteOutcome.Abstained === voteOutcome,
          [styles.rejectText]: VoteOutcome.Rejected === voteOutcome,
        })}
      >
        {getVoteOutcomeText(voteOutcome, resolutionType)}
      </p>
      {VOTE_OUTCOME_TO_ICON_MAP[voteOutcome]}
    </Button>
  );
};
