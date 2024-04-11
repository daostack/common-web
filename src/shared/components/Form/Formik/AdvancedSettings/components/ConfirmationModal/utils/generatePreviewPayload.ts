import {
  PreviewCirclesUpdateCircles,
  PreviewCirclesUpdatePayload,
} from "@/shared/interfaces";
import { InheritedCircleIntermediate } from "@/shared/models";

export const generatePreviewPayload = (
  governanceId: string,
  permissionGovernanceId: string,
  circles: InheritedCircleIntermediate[],
): PreviewCirclesUpdatePayload => {
  const circlesForPayload: PreviewCirclesUpdateCircles[] = circles
    .filter((circle) => circle.selected)
    .map((circle) => {
      if (!circle.circleId) {
        return null;
      }

      const { inheritFrom } = circle;

      return {
        type: "existing",
        circleId: circle.circleId,
        ...(circle.synced &&
          inheritFrom?.governanceId &&
          inheritFrom?.circleId && {
            inheritFrom: {
              governanceId: inheritFrom?.governanceId,
              circleId: inheritFrom?.circleId,
            },
          }),
      };
    })
    .filter((circle): circle is PreviewCirclesUpdateCircles => Boolean(circle));

  return {
    governanceId,
    permissionGovernanceId,
    circles: circlesForPayload,
  };
};
