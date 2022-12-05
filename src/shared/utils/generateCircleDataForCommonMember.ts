import { generateCirclesBinaryNumber } from "../../pages/OldCommon/components/CommonDetailContainer/CommonWhitepaper/utils";
import { GovernanceActions, ProposalsTypes } from "../constants";
import {
  AllowedActions,
  AllowedProposals,
  CircleIndex,
  CirclesMap,
  Governance,
} from "../models";

export const circleIndexGuard = (n: number | string) => {
  const castedN = Number(n);

  if (castedN < 0 || castedN > 31)
    throw new Error("Circle index validation failed");

  return castedN as CircleIndex;
};

export const generateCirclesDataForCommonMember = (
  governanceCircles: Governance["circles"],
  circleIds: string[],
): {
  circles: CirclesMap;
  allowedActions: AllowedActions;
  allowedProposals: AllowedProposals;
} => {
  const circleIdsSet = new Set(circleIds);

  const circlesIndexesByHierarchy = new Set<CircleIndex>();

  const circleIdsByHierarchy = new Set<string>();

  circleIdsSet.forEach((id) => {
    const circle = Object.entries(governanceCircles).find(
      ([_, circle]) => circle.id === id,
    );
    if (!circle || !circle[1])
      throw new Error(`could not find cirlce in governance ${id}`);
    circleIdsByHierarchy.add(circle?.[1].id);
    circlesIndexesByHierarchy.add(circleIndexGuard(circle[0]));

    if (circle[1].hierarchy) {
      Object.entries(governanceCircles).forEach(([index, govCircle]) => {
        if (
          govCircle?.hierarchy &&
          circle[1].hierarchy &&
          govCircle.hierarchy.tier < circle[1].hierarchy.tier &&
          !circle[1].hierarchy.exclusions.find(
            (tier) => govCircle.hierarchy && govCircle.hierarchy.tier === tier,
          )
        )
          circleIdsByHierarchy.add(govCircle.id);
        circlesIndexesByHierarchy.add(circleIndexGuard(index));
      });
    }
  });

  type ASSIGN_OR_REMOVE =
    | ProposalsTypes.ASSIGN_CIRCLE
    | ProposalsTypes.REMOVE_CIRCLE;

  const allowedActions = new Set<GovernanceActions>();
  const allowedProposals = new Set<Exclude<ProposalsTypes, ASSIGN_OR_REMOVE>>();
  const assignCircleProposal = new Set<string>();
  const removeCircleProposal = new Set<string>();

  circleIdsByHierarchy.forEach((circleId) => {
    const circle = Object.entries(governanceCircles).find(
      ([_, circle]) => circle.id === circleId,
    );

    if (!circle) throw new Error("could not find cirlce in governance");

    Object.keys(circle[1].allowedActions).forEach((action) => {
      allowedActions.add(action as GovernanceActions);
    });

    Object.keys(circle[1].allowedProposals).forEach((proposal) => {
      if (
        proposal === ProposalsTypes.ASSIGN_CIRCLE ||
        proposal === ProposalsTypes.REMOVE_CIRCLE
      ) {
        Object.keys(
          circle[1].allowedProposals[proposal] as Record<string, boolean>,
        ).forEach((circleId) => {
          if (proposal === ProposalsTypes.ASSIGN_CIRCLE)
            assignCircleProposal.add(circleId);
          if (proposal === ProposalsTypes.REMOVE_CIRCLE)
            removeCircleProposal.add(circleId);
        });
      } else {
        allowedProposals.add(
          proposal as Exclude<ProposalsTypes, ASSIGN_OR_REMOVE>,
        );
      }
    });
  });

  const circlesBin = generateCirclesBinaryNumber(
    Array.from(circlesIndexesByHierarchy),
  );

  const circlesMap = Array.from(circlesIndexesByHierarchy).reduce(
    (prev, next) => {
      const circle = governanceCircles[next];
      if (!circle)
        throw new Error(
          `could not find cirlce in governance ${JSON.stringify(circle)}`,
        );
      circleIdsByHierarchy.add(circle?.[1].id);
      return { ...prev, [next]: circle.id };
    },
    {},
  );

  return {
    circles: { bin: circlesBin, map: circlesMap },
    allowedActions: Array.from(allowedActions).reduce((prev, next) => {
      return { ...prev, [next]: true };
    }, {}),
    allowedProposals: Array.from(allowedProposals).reduce(
      (prev, next) => {
        return { ...prev, [next]: true };
      },
      {
        ...(assignCircleProposal.size && {
          [ProposalsTypes.ASSIGN_CIRCLE]: Array.from(
            assignCircleProposal,
          ).reduce((prev, next) => {
            return { ...prev, [next]: true };
          }, {}),
        }),
        ...(removeCircleProposal.size && {
          [ProposalsTypes.REMOVE_CIRCLE]: Array.from(
            removeCircleProposal,
          ).reduce((prev, next) => {
            return { ...prev, [next]: true };
          }, {}),
        }),
      },
    ),
  };
};
