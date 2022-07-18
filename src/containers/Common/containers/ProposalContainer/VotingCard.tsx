import React, { FC, useMemo } from "react";
import classNames from "classnames";
import { VotingCardType } from "@/shared/models";
import { ProgressBar } from "@/shared/components";
import { ReactElement } from "hoist-non-react-statics/node_modules/@types/react";

interface VotingCardProps {
  type: VotingCardType;
  votedMembersAmount: number;
  targetVotersAmount?: number;
  membersAmount?: number;
  percentageCondition?: number;
  className?: string;
}

export const VotingCard: FC<VotingCardProps> = (
  {
    type,
    votedMembersAmount,
    targetVotersAmount,
    percentageCondition,
    membersAmount,
    className
  }
) => {
  const cardTitle = useMemo((): string | ReactElement => {
    switch (type) {
      case VotingCardType.AllVotes:
        return <div className="votes-title-container">
          <div className="title">{VotingCardType.AllVotes}</div>
          <div className="ratio">{votedMembersAmount}/{membersAmount}</div>
          <img width={24} height={28} src="/icons/right-arrow.svg" alt="right-arrow" />
        </div>;
      default:
        return type;
    }
  }, [type, votedMembersAmount, membersAmount]);

  const cardPercentCondition = useMemo((): string => {
    switch (type) {
      case VotingCardType.AllVotes:
        return `Required Quorum: ${percentageCondition}%`;
      case VotingCardType.Support:
        return `Required Support: ${percentageCondition}%`;
      case VotingCardType.Object:
        return `Allowed Object: ${percentageCondition}%`;
      case VotingCardType.Abstain:
        return "";
    }
  }, [type, percentageCondition]);

  const completedPercentage = useMemo((): number => {
    const calcPercentage = (actualAmount, totalAmount) =>
      (!actualAmount || !totalAmount)
        ? 0
        : (Math.round((actualAmount / totalAmount) * 100 * 100) / 100);

    switch (type) {
      case VotingCardType.AllVotes:
        return calcPercentage(votedMembersAmount, membersAmount);
      default:
        return calcPercentage(targetVotersAmount, votedMembersAmount);
    }
  }, [type, votedMembersAmount, membersAmount, targetVotersAmount]);

  const minPercentCondition = useMemo(() => {
    switch (type) {
      case VotingCardType.AllVotes:
      case VotingCardType.Support:
        return percentageCondition;
      default:
        return undefined;
    }
  }, [type, percentageCondition]);

  const maxPercentCondition = useMemo(() => {
    switch (type) {
      case VotingCardType.Object:
        return percentageCondition;
      default:
        return undefined;
    }
  }, [type, percentageCondition]);

  return (
    <div className={classNames("voting-card__wrapper", className)}>
      <div className="voting-card__title">
        {cardTitle}
      </div>
      <ProgressBar
        completedPercentage={completedPercentage}
        minPercentCondition={minPercentCondition}
        maxPercentCondition={maxPercentCondition}
      />
      <div className="voting-card__percent-condition">
        {cardPercentCondition}
      </div>
    </div>
  );
};
