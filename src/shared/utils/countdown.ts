import { ProposalState } from "@/shared/models";
import { BaseProposal } from "@/shared/models/governance/proposals";

export const checkIsCountdownState = ({
  state,
}: Pick<BaseProposal, "state">): boolean =>
  [ProposalState.VOTING, ProposalState.DISCUSSION].includes(state);
