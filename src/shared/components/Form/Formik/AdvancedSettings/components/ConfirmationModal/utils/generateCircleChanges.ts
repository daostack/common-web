import { UserService } from "@/services";
import { PreviewCirclesUpdateResponse } from "@/shared/interfaces";
import { getUserName } from "@/shared/utils";
import { CircleChange } from "../types";

export const generateCircleChanges = async ({
  changes,
}: PreviewCirclesUpdateResponse): Promise<CircleChange[]> => {
  const circleChanges: CircleChange[] = [];

  await Promise.all(
    changes.map(
      (change) =>
        Promise.all(
          change.members.map(async (member) => {
            const user = await UserService.getCachedUserById(member.id);
            const userName = getUserName(user) || "Unknown";

            member.circlesAdded.forEach((addedCircle) => {
              circleChanges.push({
                userName,
                circleName: addedCircle.name,
                added: true,
              });
            });
            member.circlesRemoved.forEach((removedCircle) => {
              circleChanges.push({
                userName,
                circleName: removedCircle.name,
                added: false,
              });
            });
          }),
        ),
      [],
    ),
  );

  return circleChanges;
};
