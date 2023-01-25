import React, { useLayoutEffect } from "react";
import classNames from "classnames";
import {
  calculateVotingStatus,
  checkIsFailingVoting,
  checkIsVotingFinished,
} from "@/pages/OldCommon/components/ProposalContainer/CountDownCard/helpers";
import { getVotersString } from "@/pages/OldCommon/containers/ProposalContainer/helpers";
import { useCountdown } from "@/shared/hooks";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Governance, Proposal } from "@/shared/models";
import { FeedCountdown } from "../../../FeedCard";
import { ModalTriggerButton } from "../ModalTriggerButton";
import { Voters } from "../Voters";
import { VotingInfo } from "../VotingInfo";
import { getCountdownLabel } from "./utils";
import styles from "./ProposalFeedVotingInfo.module.scss";

export interface ProposalFeedVotingInfoProps {
  proposal: Proposal;
  governanceCircles: Governance["circles"];
}

export const ProposalFeedVotingInfo: React.FC<ProposalFeedVotingInfoProps> = (
  props,
) => {
  const { proposal, governanceCircles } = props;
  const isTabletView = useIsTabletView();
  const {
    startCountdown,
    timer,
    isFinished: isCountdownFinished,
  } = useCountdown();
  const expirationTimestamp =
    proposal.data.votingExpiresOn || proposal.data.discussionExpiresOn;
  const votersString = getVotersString(
    proposal.global.weights,
    governanceCircles,
  );
  const votingStatus = calculateVotingStatus(proposal);

  useLayoutEffect(() => {
    if (expirationTimestamp) {
      startCountdown(new Date(expirationTimestamp.seconds * 1000));
    }
  }, [startCountdown, expirationTimestamp]);

  return (
    <div className={styles.container}>
      <VotingInfo
        label={getCountdownLabel(proposal.state, isCountdownFinished)}
      >
        <p className={classNames(styles.text, styles.timeToVote)}>
          <FeedCountdown
            timeAgoClassName={styles.timeAgoClassName}
            timer={timer}
            isCountdownFinished={isCountdownFinished}
            expirationTimestamp={expirationTimestamp}
          />
        </p>
      </VotingInfo>
      <VotingInfo label="Votes">
        <Voters
          triggerEl={
            <ModalTriggerButton>
              {proposal.votes.total}/
              {proposal.votes.totalMembersWithVotingRight}
            </ModalTriggerButton>
          }
          proposalId={proposal.id}
          totalVotes={proposal.votes.total}
          totalMembersWithVotingRight={
            proposal.votes.totalMembersWithVotingRight
          }
          isMobileVersion={isTabletView}
        />
      </VotingInfo>
      <VotingInfo label="Voters">
        <p
          className={classNames(styles.text, styles.voters)}
          title={votersString}
        >
          {votersString}
        </p>
      </VotingInfo>
      <VotingInfo
        label={checkIsVotingFinished(votingStatus) ? "Result" : "Status"}
      >
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
