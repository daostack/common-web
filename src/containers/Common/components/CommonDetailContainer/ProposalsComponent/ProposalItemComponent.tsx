import React from "react";
import { UserAvatar, ElementDropdown } from "@/shared/components";
import { Proposal } from "@/shared/models";
import { getUserName } from "@/shared/utils";
import { DynamicLinkType } from "@/shared/constants";
import ProposalState from "../ProposalState/ProposalState";
import { VotesComponent } from "../VotesComponent";
import { useCommonMember } from "@/containers/Common/hooks";

interface ProposalItemComponentProps {
  loadProposalDetail: (payload: Proposal) => void;
  proposal: Proposal;
}

export default function ProposalItemComponent({
  proposal,
  loadProposalDetail,
}: ProposalItemComponentProps) {

  const {
    data: commonMember,
  } = useCommonMember();

  return (
    <div className="proposal-item-wrapper">
      <div className="proposal-item-header">
        <div
          onClick={() => loadProposalDetail(proposal)}
          className="proposal-title"
          title={proposal.data.args.title}
        >
          {proposal.data.args.title}
        </div>
        <ElementDropdown
          linkType={DynamicLinkType.Proposal}
          elem={proposal}
          transparent
        />
      </div>
      <div className="proposal-item-body">
        <div className="user-info-wrapper">
          <UserAvatar
            photoURL={proposal.proposer?.photoURL}
            nameForRandomAvatar={proposal.proposer?.email}
            userName={getUserName(proposal.proposer)}
          />
          <div className="name-and-proposal-state">
            <div className="user-name">{getUserName(proposal.proposer)}</div>
            <ProposalState proposal={proposal} />
          </div>
        </div>
        <div className="proposal-item-votes-wrapper">
          <VotesComponent
            proposal={proposal}
            commonMember={commonMember}
            preview
            compact
          />
        </div>
        <div className="proposal-item-bottom">
          <div className="discussion-count-wrapper">
            <img src="/icons/discussions.svg" alt="discussions" />
            <div className="discussion-count">{proposal.discussionMessage?.length || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
