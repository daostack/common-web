import React, { useCallback } from "react";
import classNames from "classnames";
import { VoteAbstain, VoteAgainst, VoteFor } from "@/shared/icons";
import { VoteType } from "@/shared/models";
import { Button } from "@/shared/ui-kit";
import styles from "./VoteButton.module.scss";

interface VoteButtonProps {
  voteType: VoteType;
}

const VOTE_TYPE_TO_TEXT_MAP: Record<VoteType, string> = {
  [VoteType.Approve]: "Vote for",
  [VoteType.Abstain]: "Abstain",
  [VoteType.Reject]: "Vote against",
};

export const VoteButton: React.FC<VoteButtonProps> = ({ voteType }) => {
  const VoteIcon = useCallback(() => {
    switch (voteType) {
      case VoteType.Approve: {
        return <VoteFor />;
      }
      case VoteType.Abstain: {
        return <VoteAbstain />;
      }
      case VoteType.Reject: {
        return <VoteAgainst />;
      }
      default:
        return <></>;
    }
  }, [voteType]);

  return (
    <Button
      className={classNames(styles.button, {
        [styles.approveButton]: VoteType.Approve === voteType,
        [styles.abstainButton]: VoteType.Abstain === voteType,
        [styles.rejectButton]: VoteType.Reject === voteType,
      })}
    >
      <p
        className={classNames(styles.buttonText, {
          [styles.approveText]: VoteType.Approve === voteType,
          [styles.abstainText]: VoteType.Abstain === voteType,
          [styles.rejectText]: VoteType.Reject === voteType,
        })}
      >
        {VOTE_TYPE_TO_TEXT_MAP[voteType]}
      </p>
      <VoteIcon />
    </Button>
  );
};
