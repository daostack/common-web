import { Proposal, ProposalState, Vote } from "@/shared/models";

export const checkIsVotingAllowed = ({
  userVote,
  proposal,
}: {
  userVote?: Vote | null;
  proposal: Proposal;
}): boolean => Boolean(!userVote && proposal.state === ProposalState.VOTING);
