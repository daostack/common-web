import { ApiEndpoint, GovernanceActions } from "@/shared/constants";
import { CreateProjectPayload } from "@/shared/interfaces";
import { Common, CommonState, Governance } from "@/shared/models";
import {
  generateCirclesDataForCommonMember,
  getProjectCircleDefinition,
} from "@/shared/utils";
import Api from "./Api";
import CommonService from "./Common";

class ProjectService {
  public parseDataToProjectsInfo = (
    commons: Common[],
    commonIdsWithMembership: string[] = [],
    permissionsData?: {
      governance: Governance;
      commonMemberCircleIds: string[];
    }[],
  ): {
    common: Common;
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

        return {
          common,
          hasMembership: commonIdsWithMembership.some(
            (commonId) => commonId === common.id,
          ),
          hasPermissionToAddProject:
            permissionsItem &&
            generateCirclesDataForCommonMember(
              permissionsItem.governance.circles,
              permissionsItem.commonMemberCircleIds,
            ).allowedActions[GovernanceActions.CREATE_PROJECT],
          hasPermissionToLinkToHere:
            permissionsItem &&
            generateCirclesDataForCommonMember(
              permissionsItem.governance.circles,
              permissionsItem.commonMemberCircleIds,
            ).allowedActions[GovernanceActions.LINK_TO_HERE],
          hasPermissionToMoveToHere:
            permissionsItem &&
            generateCirclesDataForCommonMember(
              permissionsItem.governance.circles,
              permissionsItem.commonMemberCircleIds,
            ).allowedActions[GovernanceActions.MOVE_TO_HERE],
        };
      });

  public getUserProjectsInfo = async (
    userId: string,
  ): Promise<{ common: Common; hasMembership: boolean }[]> => {
    const userCommonIds = await CommonService.getUserCommonIds(userId);
    const commons = await CommonService.getCommonsWithSubCommons(userCommonIds);

    return this.parseDataToProjectsInfo(commons, userCommonIds);
  };

  public getProjectsInfo = async (
    userId?: string,
    additionalIdToFetch?: string,
  ): Promise<{ common: Common; hasMembership: boolean }[]> => {
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
  ): Promise<Common> => {
    const { advancedSettings, ...subCommonData } = data;
    const {
      data: { circleProjectSubcommon },
    } = await Api.post<{ circleProjectSubcommon: Common }>(
      ApiEndpoint.CreateAction,
      {
        type: GovernanceActions.CREATE_SUBCOMMON,
        args: {
          commonId: parentCommonId,
          subcommonDefinition: subCommonData,
          ...advancedSettings,
        },
      },
    );

    return circleProjectSubcommon;
  };
}

export default new ProjectService();
