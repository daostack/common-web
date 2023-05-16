import React from "react";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { UserAvatar, ElementDropdown } from "@/shared/components";
import { EntityTypes, ProposalsTypes } from "@/shared/constants";
import { Proposal } from "@/shared/models";
import {
  StaticLinkType,
  formatPrice,
  getTextForProposalType,
  getUserName,
} from "@/shared/utils";
import ProposalState from "../ProposalState/ProposalState";
import { VotesComponent } from "../VotesComponent";

interface ProposalItemComponentProps {
  loadProposalDetail: (payload: Proposal) => void;
  proposal: Proposal;
}

export default function ProposalItemComponent({
  proposal,
  loadProposalDetail,
}: ProposalItemComponentProps) {
  const { data: commonMember } = useCommonMember();

  let extraData;
  switch (proposal.type) {
    case ProposalsTypes.FUNDS_ALLOCATION:
      extraData = formatPrice(proposal.data.args.amount, {
        shouldRemovePrefixFromZero: false,
      });
      break;
  }

  return (
    <div
      className="proposal-item-wrapper"
      onClick={() => loadProposalDetail(proposal)}
    >
      <div className="proposal-item-header">
        <div className="proposal-item-header-top">
          <div className="proposal-title" title={proposal.data.args.title}>
            {proposal.data.args.title}
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <ElementDropdown
              entityType={EntityTypes.Proposal}
              linkType={StaticLinkType.Proposal}
              elem={proposal}
              ownerId={proposal.proposer?.uid}
              commonId={proposal.data?.args?.commonId}
              transparent
              feedItemId="" // this is old ui - adding this to avoid error. feedItemId can't be optional here.
            />
          </div>
        </div>
        <div className="proposal-item-type">
          {getTextForProposalType(proposal.type)}
        </div>
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
            <div className="discussion-count">
              {proposal.discussion?.messageCount || 0}
            </div>
          </div>
          <div className="extra-data">{extraData}</div>
        </div>
      </div>
    </div>
  );
}
