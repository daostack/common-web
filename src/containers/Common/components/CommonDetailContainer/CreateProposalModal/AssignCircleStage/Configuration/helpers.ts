import { Circle } from "@/shared/models";

export const getAllowedCirclesToBeAssigned = (
  circles: Circle[],
  circleDefinitionForCircleRelatedProposal?: Partial<Record<string, true>>
): Circle[] => {
  if (!circleDefinitionForCircleRelatedProposal) {
    return [];
  }

  return circles.filter(
    (circle) => circleDefinitionForCircleRelatedProposal[circle.id]
  );
};
