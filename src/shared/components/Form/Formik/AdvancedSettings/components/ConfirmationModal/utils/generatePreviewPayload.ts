import {
  PreviewCirclesUpdateCircles,
  PreviewCirclesUpdatePayload,
} from "@/shared/interfaces";
import { Circles, InheritedCircleIntermediate } from "@/shared/models";

export const generatePreviewPayload = (
  governanceId: string,
  permissionGovernanceId: string,
  circles: InheritedCircleIntermediate[],
  initialCircles?: Circles | null,
): PreviewCirclesUpdatePayload => {
  const convertedInitialCircles = Object.values(initialCircles || {});
  const circlesForPayload: PreviewCirclesUpdateCircles[] = circles
    .filter((circle) => circle.selected)
    .map((circle) => {
      const { inheritFrom } = circle;
      const initialCircle = convertedInitialCircles.find(
        (initialCircle) =>
          initialCircle.derivedFrom?.circleId === circle.circleId,
      );

      return {
        type: initialCircle ? "existing" : "new",
        circleId: initialCircle?.id || circle.circleId,
        ...(circle.synced &&
          inheritFrom && {
            inheritFrom: {
              governanceId: inheritFrom.governanceId,
              circleId: inheritFrom.circleId,
            },
          }),
      };
    });

  return {
    governanceId,
    permissionGovernanceId,
    circles: circlesForPayload,
  };
};
