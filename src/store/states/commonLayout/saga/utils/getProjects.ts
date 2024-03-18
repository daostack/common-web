import {
  CommonService,
  GovernanceService,
  ProjectService,
  UserService,
} from "@/services";
import { ProjectsStateItem } from "../../../projects";
import { getPermissionsDataByAllUserCommonMemberInfo } from "./getPermissionsDataByAllUserCommonMemberInfo";

export const getProjects = async (
  commonId: string,
  userId?: string,
): Promise<ProjectsStateItem[]> => {
  const commonsWithSubCommons = await CommonService.getCommonsWithSubCommons([
    commonId,
  ]);
  const commonsWithoutMainParentCommon = commonsWithSubCommons.filter(
    (common) => common.id !== commonId,
  );
  const userMemberships =
    (userId && (await UserService.getUserMemberships(userId))?.commons) || {};
  const userCommonIds = Object.keys(userMemberships);
  const governanceList = await GovernanceService.getGovernanceListByCommonIds(
    userCommonIds,
  );
  const permissionsData = getPermissionsDataByAllUserCommonMemberInfo(
    userMemberships,
    governanceList,
  );
  const data = ProjectService.parseDataToProjectsInfo(
    commonsWithoutMainParentCommon,
    userCommonIds,
    permissionsData,
  );

  return data.map(
    ({
      common,
      hasMembership,
      hasPermissionToAddProject,
      hasPermissionToLinkToHere,
      hasPermissionToMoveToHere,
    }) => ({
      commonId: common.id,
      image: common.image,
      name: common.name,
      directParent: common.directParent,
      rootCommonId: common.rootCommonId,
      hasMembership,
      hasPermissionToAddProject,
      hasPermissionToLinkToHere,
      hasPermissionToMoveToHere,
      notificationsAmount: 0,
    }),
  );
};
