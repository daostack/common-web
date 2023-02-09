import { ApiEndpoint, GovernanceActions } from "@/shared/constants";
import { CreateProjectPayload } from "@/shared/interfaces";
import { Common, CommonState } from "@/shared/models";
import { getProjectCircleDefinition } from "@/shared/utils";
import Api from "./Api";
import CommonService from "./Common";

class ProjectService {
  private parseDataToProjectsInfo = (
    commons: Common[],
    commonIdsWithMembership: string[] = [],
  ): { common: Common; hasMembership: boolean }[] =>
    commons
      .filter((common) => common.state === CommonState.ACTIVE)
      .map((common) => ({
        common,
        hasMembership: commonIdsWithMembership.some(
          (commonId) => commonId === common.id,
        ),
      }));

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

  public createNewProject = async (
    parentCommonId: string,
    data: CreateProjectPayload,
  ): Promise<Common> => {
    const { highestCircleId, ...subCommonData } = data;
    const {
      data: { circleProjectSubcommon },
    } = await Api.post<{ circleProjectSubcommon: Common }>(
      ApiEndpoint.CreateAction,
      {
        type: GovernanceActions.CREATE_PROJECT,
        args: {
          commonId: parentCommonId,
          subcommonDefinition: subCommonData,
          newCircleArgs: {
            circleDefinition: getProjectCircleDefinition(
              subCommonData.name,
              highestCircleId,
            ),
          },
        },
      },
    );

    return circleProjectSubcommon;
  };
}

export default new ProjectService();
