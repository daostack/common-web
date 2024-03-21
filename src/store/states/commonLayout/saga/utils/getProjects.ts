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
  const [commonFlatTree, userMembershipsWithId] = await Promise.all([
    CommonService.getCommonFlatTree(commonId),
    userId ? UserService.getUserMemberships(userId) : null,
  ]);
  const spaces = commonFlatTree?.spaces || {};
  const userMemberships = userMembershipsWithId?.commons || {};
  const userCommonIds = Object.keys(userMemberships);
  const governanceList = await GovernanceService.getGovernanceListByCommonIds(
    userCommonIds,
  );
  const permissionsData = getPermissionsDataByAllUserCommonMemberInfo(
    userMemberships,
    governanceList,
  );
  const data = ProjectService.parseDataToProjectsInfo(
    Object.values(spaces),
    userCommonIds,
    permissionsData,
  );

  return data
    .map(
      ({
        common,
        hasAccessToSpace,
        hasMembership,
        hasPermissionToAddProject,
        hasPermissionToLinkToHere,
        hasPermissionToMoveToHere,
      }) => ({
        commonId: common.id,
        image: common.image || "",
        name: common.name,
        directParent: {
          commonId: common.parentId,
          circleId: "",
        },
        rootCommonId: commonId,
        hasAccessToSpace,
        hasMembership,
        hasPermissionToAddProject,
        hasPermissionToLinkToHere,
        hasPermissionToMoveToHere,
        notificationsAmount: 0,
        listVisibility: common.listVisibility,
      }),
    )
    .filter(({ hasAccessToSpace }) => hasAccessToSpace);
};
