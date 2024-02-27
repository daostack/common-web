import { InheritedCircleIntermediate } from "@/shared/models";

export const getCirclesTiers = (circles: InheritedCircleIntermediate[]) => {
  return circles.reduce((acc, circle) => {
    if (
      circle.selected &&
      circle.synced &&
      circle.inheritFrom &&
      Number.isInteger(circle?.inheritFrom?.tier)
    ) {
      acc.push(circle.inheritFrom.tier as number);
    }
    return acc;
  }, [] as number[]);
};
