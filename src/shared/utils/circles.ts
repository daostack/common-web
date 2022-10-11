import { Circle } from "../models";

export const getFilteredByIdCircles = (
  circles: Circle[] | null,
  circleIds?: string[]
): Circle[] => {
  if (!circles || circles.length === 0) {
    return [];
  }
  if (!circleIds || circleIds.length === 0) {
    return [...circles];
  }

  return circles.filter(({ id }) => circleIds.includes(id));
};
