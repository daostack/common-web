import { GovernanceActions, ProposalsTypes } from "@/shared/constants";
import { CommonMember, Governance } from "@/shared/models";
import { generateCirclesDataForCommonMember } from "./generateCircleDataForCommonMember";

type Query = {
  commonMember: CommonMember;
  governance: Pick<Governance, "circles">;
} & (
  | {
      action: GovernanceActions;
    }
  | {
      proposal: ProposalsTypes;
    }
);

/**
 * Doesnt check for nested permissions, i.e assign/remove circle - these are check on the proposal creation level
 */
export const hasPermission = (query: Query): boolean => {
  const { commonMember, governance } = query;
  if (!commonMember || !governance) {
    return false;
  }

  try {
    const circlesPermissions = generateCirclesDataForCommonMember(
      governance.circles,
      commonMember.circleIds,
    );

    if (
      "proposal" in query &&
      Object.values(ProposalsTypes).includes(query.proposal)
    ) {
      if (
        !circlesPermissions?.allowedActions[GovernanceActions.CREATE_PROPOSAL]
      ) {
        return false;
      }

      return Boolean(circlesPermissions?.allowedProposals[query.proposal]);
    }

    if (
      "action" in query &&
      Object.values(GovernanceActions).includes(query.action)
    ) {
      return Boolean(circlesPermissions?.allowedActions[query.action]);
    }
  } catch (err) {
    return false;
  }

  return false;
};
