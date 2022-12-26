import React from "react";
import {
  FeedCard,
  FeedCardHeader,
  FeedCardContent,
  FeedCardFooter,
  FeedCardHeaderProps,
  FeedCardContentProps,
  FeedCardFooterProps,
} from "../FeedCard";
import {
  ProposalFeedVotingInfo,
  ProposalFeedButtonContainer,
  ProposalFeedVotingInfoProps,
} from "./components";

// import styles from "./ProposalFeedCard.module.scss";

interface ProposalFeedCardProps {
  headerProps: FeedCardHeaderProps;
  contentProps: FeedCardContentProps;
  votingInfoProps: ProposalFeedVotingInfoProps;
  footerProps: FeedCardFooterProps;
}

export const ProposalFeedCard: React.FC<ProposalFeedCardProps> = ({
  headerProps,
  contentProps,
  votingInfoProps,
  footerProps,
}) => {
  return (
    <FeedCard>
      <FeedCardHeader {...headerProps} />
      <FeedCardContent {...contentProps}>
        <ProposalFeedVotingInfo {...votingInfoProps} />
        <ProposalFeedButtonContainer />
      </FeedCardContent>
      <FeedCardFooter {...footerProps} />
    </FeedCard>
  );
};
