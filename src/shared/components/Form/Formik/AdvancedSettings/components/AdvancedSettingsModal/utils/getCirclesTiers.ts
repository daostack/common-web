import { InheritedCircleIntermediate } from "@/shared/models";

export const getCirclesTiers = (circles: InheritedCircleIntermediate[]) => {
  return circles.reduce((acc, obj) => {
    if (
      obj.synced &&
      obj.inheritFrom &&
      Number.isInteger(obj?.inheritFrom?.tier)
    ) {
      acc.push(obj.inheritFrom.tier as number);
    }
    return acc;
  }, [] as number[]);
};
