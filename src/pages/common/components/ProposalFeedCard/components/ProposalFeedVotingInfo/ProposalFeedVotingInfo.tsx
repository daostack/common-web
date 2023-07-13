import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useHistory, useParams } from "react-router";
import classNames from "classnames";
import {
  VotingStatus,
  calculateVotingStatus,
  checkIsFailingVoting,
  checkIsVotingFinished,
} from "@/pages/OldCommon/components/ProposalContainer/CountDownCard/helpers";
import { getVotersString } from "@/pages/OldCommon/containers/ProposalContainer/helpers";
import { CommonRouterParams } from "@/pages/common/BaseCommon";
import { ProposalsTypes } from "@/shared/constants";
import { useRoutesContext } from "@/shared/contexts";
import { useCountdown } from "@/shared/hooks";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Governance, Proposal } from "@/shared/models";
import { checkIsCountdownState } from "@/shared/utils";
import { FeedCountdown } from "../../../FeedCard";
import { ModalTriggerButton } from "../ModalTriggerButton";
import { Voters } from "../Voters";
import { VotingInfo } from "../VotingInfo";
import { CountdownWidth } from "./constants";
import {
  getCountdownLabel,
  getProposalVotingStylesConfiguration,
} from "./utils";
import styles from "./ProposalFeedVotingInfo.module.scss";

export interface ProposalFeedVotingInfoProps {
  proposal: Proposal;
  governanceCircles: Governance["circles"];
  directParentId?: string;
}

export const ProposalFeedVotingInfo: React.FC<ProposalFeedVotingInfoProps> = (
  props,
) => {
  const { proposal, governanceCircles, directParentId } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const isTabletView = useIsTabletView();
  const history = useHistory();
  const { id: commonId } = useParams<CommonRouterParams>();
  const { getCommonPagePath } = useRoutesContext();
  const {
    startCountdown,
    timer,
    isFinished: isTimerFinished,
    ...timerDiff
  } = useCountdown();
  const expirationTimestamp =
    proposal.data.votingExpiresOn || proposal.data.discussionExpiresOn;
  const votersString = getVotersString(
    proposal.global.weights,
    governanceCircles,
  );
  const votingStatus = calculateVotingStatus(proposal);
  const isCountdownFinished =
    isTimerFinished || !checkIsCountdownState(proposal);
  const proposalVotingStylesConfiguration =
    getProposalVotingStylesConfiguration(containerRef.current?.clientWidth);
  const countdownClassName = !isCountdownFinished
    ? classNames(
        styles.countdown,
        {
          [styles.countdownNarrow]: timerDiff.days === 0,
        },
        timerDiff.days >= 1
          ? {
              [styles.countdownWide]:
                proposalVotingStylesConfiguration.countdownWidth ===
                CountdownWidth.Wide,
              [styles.countdownNarrow]:
                proposalVotingStylesConfiguration.countdownWidth ===
                CountdownWidth.Narrow,
              [styles.countdownWidthUnset]:
                proposalVotingStylesConfiguration.countdownWidth ===
                CountdownWidth.Unset,
            }
          : {},
      )
    : "";

  useLayoutEffect(() => {
    if (expirationTimestamp) {
      startCountdown(new Date(expirationTimestamp.seconds * 1000));
    }
  }, [startCountdown, expirationTimestamp]);

  useEffect(() => {
    if (
      proposal.type === ProposalsTypes.DELETE_COMMON &&
      votingStatus === VotingStatus.Approved &&
      proposal.data.args.commonId === commonId &&
      directParentId
    ) {
      history.push(getCommonPagePath(directParentId));
    }
  }, [votingStatus, directParentId]);

  return (
    <div
      ref={containerRef}
      className={classNames(styles.container, {
        [styles.containerCol1]:
          proposalVotingStylesConfiguration.columnsAmount === 1,
        [styles.containerCol2]:
          proposalVotingStylesConfiguration.columnsAmount === 2,
        [styles.containerCol4]:
          proposalVotingStylesConfiguration.columnsAmount === 4,
      })}
    >
      <VotingInfo
        label={getCountdownLabel(proposal.state, isCountdownFinished)}
      >
        <p className={classNames(styles.text, styles.timeToVote)}>
          <FeedCountdown
            className={countdownClassName}
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
          className={classNames(styles.text, styles.voters, {
            [styles.votersNonShortened]:
              !proposalVotingStylesConfiguration.shouldVotersBeShortened,
          })}
          title={votersString}
        >
          {votersString}
        </p>
      </VotingInfo>
      <VotingInfo
        label={checkIsVotingFinished(votingStatus) ? "Result" : "Status"}
      >
        <span
          className={classNames(styles.votingStatus, {
            [styles.votingStatusFailing]: checkIsFailingVoting(votingStatus),
          })}
        >
          {votingStatus}
        </span>
      </VotingInfo>
    </div>
  );
};
