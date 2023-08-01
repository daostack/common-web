import { ProposalsTypes } from "@/shared/constants";
import { Governance, Proposal } from "@/shared/models";
import { isAssignCircleProposal } from "@/shared/models/governance/proposals";

interface AdditionalData {
  governanceCircles?: Governance["circles"];
}

const PROPOSAL_TYPES_WITH_HIDDEN_TITLE = [ProposalsTypes.DELETE_COMMON];

export const getProposalTitleString = (
  proposal: Proposal,
  additionalData: AdditionalData = {},
): string => {
  if (PROPOSAL_TYPES_WITH_HIDDEN_TITLE.includes(proposal.type)) {
    return "";
  }

  if (isAssignCircleProposal(proposal)) {
    const targetCircle = Object.values(
      additionalData.governanceCircles || {},
    ).find((circle) => circle.id === proposal.data.args.circleId);

    return `Request to join ${
      targetCircle?.name ? `${targetCircle.name} ` : ""
    }`;
  }

  return proposal.data.args.title;
};
