import { ApiEndpoint, GovernanceActions } from "@/shared/constants";
import { CreateProjectPayload, SpaceListVisibility } from "@/shared/interfaces";
import { Common, CommonState, Governance } from "@/shared/models";
import { generateCirclesDataForCommonMember } from "@/shared/utils";
import Api from "./Api";
import CommonService from "./Common";

class ProjectService {
  public parseDataToProjectsInfo = <
    T extends Pick<Common, "id" | "state" | "listVisibility">,
  >(
    commons: T[],
    commonIdsWithMembership: string[] = [],
    permissionsData?: {
      governance: Pick<Governance, "commonId" | "circles">;
      commonMemberCircleIds: string[];
    }[],
  ): {
    common: T;
    hasAccessToSpace: boolean;
    hasMembership: boolean;
    hasPermissionToAddProject?: boolean;
    hasPermissionToLinkToHere?: boolean;
    hasPermissionToMoveToHere?: boolean;
  }[] =>
    commons
      .filter((common) => common.state === CommonState.ACTIVE)
      .map((common) => {
        const permissionsItem = permissionsData?.find(
          (item) => item.governance.commonId === common.id,
        );
        const hasMembership = commonIdsWithMembership.some(
          (commonId) => commonId === common.id,
        );
        const circlesPermissions =
          permissionsItem &&
          generateCirclesDataForCommonMember(
            permissionsItem.governance.circles,
            permissionsItem.commonMemberCircleIds,
          );

        return {
          common,
          hasAccessToSpace:
            hasMembership ||
            common.listVisibility === SpaceListVisibility.Public,
          hasMembership,
          hasPermissionToAddProject:
            circlesPermissions?.allowedActions[
              GovernanceActions.CREATE_PROJECT
            ],
          hasPermissionToLinkToHere:
            circlesPermissions?.allowedActions[GovernanceActions.LINK_TO_HERE],
          hasPermissionToMoveToHere:
            circlesPermissions?.allowedActions[GovernanceActions.MOVE_TO_HERE],
        };
      });

  public getUserProjectsInfo = async (
    userId: string,
  ): Promise<
    { common: Common; hasMembership: boolean; hasAccessToSpace: boolean }[]
  > => {
    const userCommonIds = await CommonService.getUserCommonIds(userId);
    const commons = await CommonService.getCommonsWithSubCommons(userCommonIds);

    return this.parseDataToProjectsInfo(commons, userCommonIds);
  };

  public getProjectsInfo = async (
    userId?: string,
    additionalIdToFetch?: string,
  ): Promise<
    { common: Common; hasMembership: boolean; hasAccessToSpace: boolean }[]
  > => {
    const finalProjectsInfo = userId
      ? await this.getUserProjectsInfo(userId)
      : [];

    if (
      !additionalIdToFetch ||
      finalProjectsInfo.some(({ common }) => common.id === additionalIdToFetch)
    ) {
      return finalProjectsInfo;
    }

    const parentCommon = await CommonService.getParentCommonForCommonId(
      additionalIdToFetch,
    );

    if (!parentCommon) {
      return finalProjectsInfo;
    }

    const additionalCommons = await CommonService.getCommonsWithSubCommons([
      parentCommon.id,
    ]);

    return finalProjectsInfo.concat(
      this.parseDataToProjectsInfo(additionalCommons),
    );
  };

  /**
   * Using new CREATE_SUBCOMMON to support advanced settings.
   * As far as I understood from Daniel, we don't need anymore newCircleArgs. Need to confirm.
   */
  public createNewProject = async (
    parentCommonId: string,
    data: CreateProjectPayload,
    isAdvancedSettingsEnabled = true,
  ): Promise<Common> => {
    const { advancedSettings, ...subCommonData } = data;
    const { data: project } = await Api.post<Common>(ApiEndpoint.CreateAction, {
      type: isAdvancedSettingsEnabled
        ? GovernanceActions.CREATE_SUBCOMMON
        : GovernanceActions.CREATE_PROJECT,
      args: {
        commonId: parentCommonId,
        subcommonDefinition: subCommonData,
        ...(isAdvancedSettingsEnabled && { ...advancedSettings }),
      },
    });

    return project;
  };
}

export default new ProjectService();
