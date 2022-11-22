import { GovernanceActions, ProposalsTypes } from "@/shared/constants";
import { CommonMember } from "@/shared/models";

interface Query {
  commonMember: CommonMember | null;
  key: ProposalsTypes | GovernanceActions;
}

/**
 * Doesnt check for nested permissions, i.e assign/remove circle - these are check on the proposal creation level
 */
export const hasPermission = ({ commonMember, key }: Query): boolean => {
  if (!commonMember) {
    return false;
  }

  if (Object.values(ProposalsTypes).includes(key as ProposalsTypes)) {
    if (!commonMember?.allowedActions[GovernanceActions.CREATE_PROPOSAL]) {
      return false;
    }

    return Boolean(commonMember?.allowedProposals[key as ProposalsTypes]);
  }

  if (Object.values(GovernanceActions).includes(key as GovernanceActions)) {
    return Boolean(commonMember?.allowedActions[key as GovernanceActions]);
  }

  return false;
};
