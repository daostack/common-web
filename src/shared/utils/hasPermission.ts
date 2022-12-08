import { GovernanceActions, ProposalsTypes } from "@/shared/constants";
import { CommonMember, Governance } from "@/shared/models";
import { generateCirclesDataForCommonMember } from "./generateCircleDataForCommonMember";

interface Query {
  commonMember: CommonMember;
  governance: Pick<Governance, "circles">;
  key: ProposalsTypes | GovernanceActions;
}

/**
 * Doesnt check for nested permissions, i.e assign/remove circle - these are check on the proposal creation level
 */
export const hasPermission = ({
  commonMember,
  governance,
  key,
}: Query): boolean => {
  if (!commonMember) {
    return false;
  }

  const circlesPermissions = generateCirclesDataForCommonMember(
    governance.circles,
    commonMember.circleIds,
  );

  if (Object.values(ProposalsTypes).includes(key as ProposalsTypes)) {
    if (
      !circlesPermissions?.allowedActions[GovernanceActions.CREATE_PROPOSAL]
    ) {
      return false;
    }

    return Boolean(circlesPermissions?.allowedProposals[key as ProposalsTypes]);
  }

  if (Object.values(GovernanceActions).includes(key as GovernanceActions)) {
    return Boolean(
      circlesPermissions?.allowedActions[key as GovernanceActions],
    );
  }

  return false;
};
