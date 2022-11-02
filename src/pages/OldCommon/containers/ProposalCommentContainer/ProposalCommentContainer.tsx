import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DynamicLinkType } from "@/shared/constants";
import {
  DiscussionMessage,
  ProposalWithHighlightedComment,
} from "@/shared/models";
import { CommonDetailContainer, Tabs } from "..";
import {
  fetchDiscussionById,
  fetchDiscussionMessageById,
  fetchProposalById,
} from "../../store/api";

interface ProposalCommentRouterParams {
  id: string;
}

const ProposalCommentContainer = () => {
  const { id: proposalCommentId } = useParams<ProposalCommentRouterParams>();
  const [currentProposalComment, setCurrentProposalComment] =
    useState<DiscussionMessage | null>(null);
  const [proposalWithHighlightedComment, setProposalWithHighlightedComment] =
    useState<ProposalWithHighlightedComment | null>(null);
  const [currentTab, setCurrentTab] = useState<Tabs | null>(null);

  useEffect(() => {
    if (
      currentProposalComment ||
      proposalWithHighlightedComment ||
      !proposalCommentId
    )
      return;

    (async () => {
      try {
        const requestingProposalComment = await fetchDiscussionMessageById(
          proposalCommentId,
        );
        const relatedDiscussion = await fetchDiscussionById(
          requestingProposalComment.discussionId,
        );
        const relatedProposal = await fetchProposalById(
          relatedDiscussion?.proposalId as string,
        );

        setCurrentProposalComment(requestingProposalComment);
        setProposalWithHighlightedComment({
          ...relatedProposal,
          highlightedCommentId: proposalCommentId,
          id: relatedProposal.id,
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, [
    currentProposalComment,
    proposalWithHighlightedComment,
    setCurrentProposalComment,
    setProposalWithHighlightedComment,
    proposalCommentId,
  ]);

  useEffect(() => {
    if (!currentProposalComment || !proposalWithHighlightedComment) return;

    setCurrentTab(Tabs.Proposals);
  }, [currentProposalComment, proposalWithHighlightedComment, setCurrentTab]);

  return (
    currentProposalComment &&
    proposalWithHighlightedComment &&
    currentTab && (
      <CommonDetailContainer
        commonId={currentProposalComment.commonId}
        activeModalElement={proposalWithHighlightedComment}
        linkType={DynamicLinkType.ProposalComment}
        tab={currentTab}
      />
    )
  );
};

export default ProposalCommentContainer;
