import { UserService } from "@/services";
import { PreviewCirclesUpdateResponse } from "@/shared/interfaces";
import { getUserName } from "@/shared/utils";
import { CircleChange, CommonCircleChange } from "../types";

const getDefaultCircleChange = (
  circleId: string,
  circleName: string,
): CircleChange => ({
  circleId,
  circleName,
  addedUsers: [],
  removedUsers: [],
});

export const generateCircleChanges = async ({
  changes,
}: PreviewCirclesUpdateResponse): Promise<CommonCircleChange[]> => {
  const commonCircleChanges: CommonCircleChange[] = [];

  await Promise.all(
    changes.map(async (change) => {
      const circleChanges: Record<string, CircleChange> = {};
      const commonCircleChange: CommonCircleChange = {
        commonId: change.commonId,
        commonName: change.commonName,
        removedUsers: [],
        changes: [],
      };

      await Promise.all(
        change.members.map(async (member) => {
          const userId = member.userId;
          const user = await UserService.getCachedUserById(userId);
          const userName = getUserName(user) || "<Unknown>";

          if (member.circleIds.length === 0) {
            commonCircleChange.removedUsers.push({ userId, userName });
            return;
          }

          member.circlesAdded.forEach((addedCircle) => {
            const circleChange =
              circleChanges[addedCircle.id] ||
              getDefaultCircleChange(addedCircle.id, addedCircle.name);
            circleChange.addedUsers.push({ userId, userName });
            circleChanges[addedCircle.id] = circleChange;
          });
          member.circlesRemoved.forEach((removedCircle) => {
            const circleChange =
              circleChanges[removedCircle.id] ||
              getDefaultCircleChange(removedCircle.id, removedCircle.name);
            circleChange.removedUsers.push({ userId, userName });
            circleChanges[removedCircle.id] = circleChange;
          });
        }),
      );

      commonCircleChange.changes = Object.values(circleChanges);
      commonCircleChanges.push(commonCircleChange);
    }),
  );

  return commonCircleChanges;
};
