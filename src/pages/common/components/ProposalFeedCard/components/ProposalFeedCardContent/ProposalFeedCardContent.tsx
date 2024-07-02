import React from "react";
import { ContextMenuItem } from "@/shared/interfaces";
import {
  CirclesPermissions,
  CommonFeed,
  CommonMember,
  Discussion,
  DiscussionNotion,
  Governance,
  Proposal,
  ResolutionType,
  User,
  Vote,
} from "@/shared/models";
import {
  checkIsCountdownState,
  GetCommonPagePath,
  getUserName,
} from "@/shared/utils";
import {
  FeedCardContent,
  FeedCardHeader,
  FeedCountdown,
  getVisibilityString,
} from "../../../FeedCard";
import { ProposalSpecificData } from "../../types";
import {
  checkIsVotingAllowed,
  checkUserPermissionsToVote,
  getProposalDescriptionString,
  getProposalSubtitle,
  getProposalTypeString,
} from "../../utils";
import { ImmediateProposalVoteInfo } from "../ImmediateProposalVoteInfo";
import {
  ImmediateProposalInfo,
  ProposalFeedButtonContainer,
  ProposalFeedVotingInfo,
  UserVoteInfo,
} from "../index";

interface ProposalFeedCardContentProps {
  commonId?: string;
  item: CommonFeed;
  governanceCircles?: Governance["circles"];
  onUserClick?: (userId: string) => void;
  isLoading: boolean;
  proposal: Proposal | null;
  commonMember: (CommonMember & CirclesPermissions) | null;
  userVote: Vote | null;
  setVote: (vote: Vote) => void;
  feedItemUser: User | null;
  proposalSpecificData: ProposalSpecificData;
  menuItems: ContextMenuItem[];
  discussionNotion?: DiscussionNotion;
  discussion: Discussion | null;
  handleOpenChat: () => void;
  onHover: (isMouseEnter: boolean) => void;
  getCommonPagePath: GetCommonPagePath;
}

export function ProposalFeedCardContent(props: ProposalFeedCardContentProps) {
  const {
    isLoading,
    proposal,
    commonMember,
    userVote,
    governanceCircles,
    feedItemUser,
    setVote,
    commonId,
    item,
    onUserClick,
    proposalSpecificData,
    menuItems,
    discussionNotion,
    discussion,
    handleOpenChat,
    onHover,
    getCommonPagePath,
  } = props;

  if (isLoading || !governanceCircles || !commonId || !proposal) {
    return null;
  }

  const isCountdownState = checkIsCountdownState(proposal);
  const userHasPermissionsToVote = checkUserPermissionsToVote({
    proposal,
    commonMember,
  });
  const isVotingAllowed =
    userHasPermissionsToVote &&
    checkIsVotingAllowed({
      userVote,
      proposal,
    });
  const circleVisibility = getVisibilityString(
    governanceCircles,
    item.circleVisibility,
    proposal?.type,
    getUserName(feedItemUser),
  );

  return (
    <>
      <FeedCardHeader
        avatar={feedItemUser?.photoURL}
        title={getUserName(feedItemUser)}
        createdAt={
          <>
            Created:{" "}
            <FeedCountdown
              isCountdownFinished
              expirationTimestamp={item.createdAt}
            />
          </>
        }
        type={getProposalTypeString(proposal.type)}
        circleVisibility={circleVisibility}
        commonId={commonId}
        userId={item.userId}
        menuItems={menuItems}
        onUserSelect={onUserClick && (() => onUserClick(item.userId))}
      />
      <FeedCardContent
        item={item}
        subtitle={getProposalSubtitle(
          proposal,
          proposalSpecificData,
          getCommonPagePath(proposalSpecificData.targetCommon?.id || ""),
        )}
        description={getProposalDescriptionString(
          proposal.data.args.description,
          proposal.type,
        )}
        notion={discussionNotion}
        images={discussion?.images}
        onClick={handleOpenChat}
        onMouseEnter={() => {
          onHover(true);
        }}
        onMouseLeave={() => {
          onHover(false);
        }}
      >
        {proposal.resolutionType === ResolutionType.WAIT_FOR_EXPIRATION && (
          <>
            <ProposalFeedVotingInfo
              proposal={proposal}
              governanceCircles={governanceCircles}
            />
            <UserVoteInfo
              userVote={userVote}
              userHasPermissionsToVote={userHasPermissionsToVote}
              isCountdownState={isCountdownState}
            />
          </>
        )}

        {proposal.resolutionType === ResolutionType.IMMEDIATE && (
          <>
            <ImmediateProposalInfo
              proposal={proposal}
              governanceCircles={governanceCircles}
              proposerUserName={getUserName(feedItemUser)}
            />
            <ImmediateProposalVoteInfo
              proposal={proposal}
              userVote={userVote}
            />
          </>
        )}

        {isVotingAllowed && (
          <ProposalFeedButtonContainer
            proposalId={proposal.id}
            onVoteCreate={setVote}
            resolutionType={proposal.resolutionType}
          />
        )}
      </FeedCardContent>
    </>
  );
}
