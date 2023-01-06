import React, { CSSProperties, useLayoutEffect } from "react";
import classNames from "classnames";
import {
  calculateVotingStatus,
  checkIsFailingVoting,
} from "@/pages/OldCommon/components/ProposalContainer/CountDownCard/helpers";
import { getVotersString } from "@/pages/OldCommon/containers/ProposalContainer/helpers";
import { useCountdown } from "@/shared/hooks";
import { Governance, Proposal, ProposalState } from "@/shared/models";
import { ModalTriggerButton } from "../ModalTriggerButton";
import { VotingInfo } from "../VotingInfo";
import styles from "./ProposalFeedVotingInfo.module.scss";

export interface ProposalFeedVotingInfoProps {
  proposal: Proposal;
  governanceCircles: Governance["circles"];
  isCountdownState: boolean;
}

export const ProposalFeedVotingInfo: React.FC<ProposalFeedVotingInfoProps> = (
  props,
) => {
  const { proposal, governanceCircles, isCountdownState } = props;
  const { startCountdown, timer } = useCountdown();
  const expirationTimestamp =
    proposal.data.votingExpiresOn || proposal.data.discussionExpiresOn;
  const votingStatus = calculateVotingStatus(proposal);
  const containerStyles = {
    "--voting-info-items-amount": isCountdownState ? 4 : 3,
  } as CSSProperties;

  useLayoutEffect(() => {
    if (expirationTimestamp) {
      startCountdown(new Date(expirationTimestamp.seconds * 1000));
    }
  }, [startCountdown, expirationTimestamp]);

  return (
    <div className={styles.container} style={containerStyles}>
      {isCountdownState && (
        <VotingInfo
          label={
            proposal.state === ProposalState.DISCUSSION
              ? "Voting starts in"
              : "Time to Vote"
          }
        >
          <p className={classNames(styles.text, styles.timeToVote)}>{timer}</p>
        </VotingInfo>
      )}
      <VotingInfo label="Votes">
        <ModalTriggerButton>
          {proposal.votes.total}/{proposal.votes.totalMembersWithVotingRight}
        </ModalTriggerButton>
      </VotingInfo>
      <VotingInfo label="Voters">
        <p className={classNames(styles.text, styles.voters)}>
          {getVotersString(proposal.global.weights, governanceCircles)}
        </p>
      </VotingInfo>
      <VotingInfo label="Status">
        <ModalTriggerButton
          className={classNames(styles.votingStatus, {
            [styles.votingStatusFailing]: checkIsFailingVoting(votingStatus),
          })}
        >
          {votingStatus}
        </ModalTriggerButton>
      </VotingInfo>
    </div>
  );
};
