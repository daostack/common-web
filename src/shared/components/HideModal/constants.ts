import { EntityTypes, GovernanceActions } from "@/shared/constants";

export const HideContentTypes = {
  [EntityTypes.Discussion]: GovernanceActions.HIDE_OR_UNHIDE_DISCUSSION,
  [EntityTypes.DiscussionMessage]: GovernanceActions.HIDE_OR_UNHIDE_MESSAGE,
  [EntityTypes.ProposalMessage]: GovernanceActions.HIDE_OR_UNHIDE_MESSAGE,
  [EntityTypes.Proposal]: GovernanceActions.HIDE_OR_UNHIDE_PROPOSAL,
};