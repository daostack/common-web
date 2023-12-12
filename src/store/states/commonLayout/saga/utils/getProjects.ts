import { CommonService, GovernanceService, ProjectService } from "@/services";
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
  const allUserCommonMemberInfo = userId
    ? await CommonService.getAllUserCommonMemberInfo(userId)
    : [];
  const userCommonIds = allUserCommonMemberInfo.map((item) => item.commonId);
  const governanceList = await GovernanceService.getGovernanceListByCommonIds(
    userCommonIds,
  );
  const permissionsData = getPermissionsDataByAllUserCommonMemberInfo(
    allUserCommonMemberInfo,
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
    }) => ({
      commonId: common.id,
      image: common.image,
      name: common.name,
      directParent: common.directParent,
      rootCommonId: common.rootCommonId,
      hasMembership,
      hasPermissionToAddProject,
      hasPermissionToLinkToHere,
      notificationsAmount: 0,
    }),
  );
};
