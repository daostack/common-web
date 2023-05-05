import { ProposalsTypes } from "@/shared/constants";
import { Governance } from "@/shared/models";
import {
  getCirclesWithLowestTier,
  getFilteredByIdCircles,
} from "@/shared/utils";

export const getVisibilityString = (
  governanceCircles: Governance["circles"],
  circleVisibility?: string[],
  proposalType?: ProposalsTypes,
  memberName?: string,
): string => {
  const filteredByIdCircles = getFilteredByIdCircles(
    governanceCircles ? Object.values(governanceCircles) : null,
    circleVisibility,
  );
  const circleNames = getCirclesWithLowestTier(filteredByIdCircles)
    .map(({ name }) => name)
    .join(", ");

  const memberSpecific =
    proposalType === ProposalsTypes.ASSIGN_CIRCLE ? `, ${memberName}` : "";

  /**
   * Temporary hide memberSpecific. See https://github.com/daostack/common-web/issues/1529
   */
  //return circleNames ? `Private, ${circleNames} ${memberSpecific}` : "Public";

  return circleNames ? `Private, ${circleNames}` : "Public";
};
