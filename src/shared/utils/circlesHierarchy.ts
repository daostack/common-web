import { Circle } from "@/shared/models";

export const getCirclesWithHighestTier = <T extends Pick<Circle, "hierarchy">>(
  circles: T[]
): T[] => {
  const finalCircles = circles.filter((circle) => !circle.hierarchy);
  const circlesWithHierarchy = circles.filter((circle) =>
    Boolean(circle.hierarchy)
  );
  const circleWithHighestTier = circlesWithHierarchy.sort(
    (prevCircle, nextCircle) => {
      if (!nextCircle.hierarchy) {
        return -1;
      }
      if (!prevCircle.hierarchy) {
        return 1;
      }

      return nextCircle.hierarchy.tier - prevCircle.hierarchy.tier;
    }
  )[0];

  if (circleWithHighestTier) {
    finalCircles.push(circleWithHighestTier);
  }

  return finalCircles;
};

export const getCirclesWithLowestTier = <T extends Pick<Circle, "hierarchy">>(
  circles: T[]
): T[] => {
  const finalCircles = circles.filter((circle) => !circle.hierarchy);
  const circlesWithHierarchy = circles.filter((circle) =>
    Boolean(circle.hierarchy)
  );
  const circleWithLowestTier = circlesWithHierarchy.sort(
    (prevCircle, nextCircle) => {
      if (!nextCircle.hierarchy) {
        return -1;
      }
      if (!prevCircle.hierarchy) {
        return 1;
      }

      return prevCircle.hierarchy.tier - nextCircle.hierarchy.tier;
    }
  )[0];

  if (circleWithLowestTier) {
    finalCircles.push(circleWithLowestTier);
  }

  return finalCircles;
};
