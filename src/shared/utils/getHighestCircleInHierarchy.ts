import { Circle } from "@/shared/models";

export const getHighestCircleInHierarchy = <
  T extends Pick<Circle, "hierarchy">
>(
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
