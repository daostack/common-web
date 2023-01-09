import { Governance } from "@/shared/models";
import {
  getCirclesWithLowestTier,
  getFilteredByIdCircles,
} from "@/shared/utils";

export const getVisibilityString = (
  governanceCircles: Governance["circles"],
  circleVisibility?: string[],
): string => {
  const filteredByIdCircles = getFilteredByIdCircles(
    governanceCircles ? Object.values(governanceCircles) : null,
    circleVisibility,
  );
  const circleNames = getCirclesWithLowestTier(filteredByIdCircles)
    .map(({ name }) => name)
    .join(", ");

  return circleNames ? `Private, ${circleNames}` : "Public";
};
