import { useCallback, useState } from "react";
import { Logger, ProjectService } from "@/services";
import { isRequestError } from "@/services/Api";
import { ErrorCode } from "@/shared/constants";
import {
  CreateProjectPayload,
  IntermediateCreateProjectPayload,
} from "@/shared/interfaces";
import { Common } from "@/shared/models";
import {
  getFileDownloadInfo,
  getFilesDownloadInfo,
  parseLinksForSubmission,
} from "@/shared/utils";

interface Return {
  isProjectCreationLoading: boolean;
  project: Common | null;
  error: string;
  createProject: (
    parentCommonId: string,
    creationData: IntermediateCreateProjectPayload,
    isAdvancedSettingsEnabled?: boolean,
  ) => Promise<void>;
}

export const useProjectCreation = (): Return => {
  const [isProjectCreationLoading, setIsProjectCreationLoading] =
    useState(false);
  const [project, setProject] = useState<Common | null>(null);
  const [error, setError] = useState("");

  const createProject = useCallback(
    async (
      parentCommonId: string,
      creationData: IntermediateCreateProjectPayload,
      isAdvancedSettingsEnabled = true,
    ) => {
      const [projectImageFile] = creationData.projectImages;

      if (isProjectCreationLoading) {
        return;
      }

      setIsProjectCreationLoading(true);

      try {
        const [projectImage, gallery] = await Promise.all([
          projectImageFile ? getFileDownloadInfo(projectImageFile) : null,
          getFilesDownloadInfo(creationData.gallery),
        ]);
        const links = parseLinksForSubmission(creationData.links || []);

        const advancedSettingsCirclesPayload =
          creationData.advancedSettings?.circles
            ?.filter((circle) => circle.selected)
            .map((circle) => ({
              circleId: circle.circleId,
              ...(circle.synced && {
                inheritFrom: {
                  governanceId: circle.inheritFrom?.governanceId,
                  circleId: circle.inheritFrom?.circleId,
                },
              }),
            }));

        const payload: CreateProjectPayload = {
          name: creationData.spaceName,
          byline: creationData.byline,
          description: creationData.description
            ? JSON.stringify(creationData.description)
            : "",
          image: projectImage?.value || "",
          gallery,
          video: creationData.videoUrl
            ? {
              title: `Space ${creationData.spaceName} Video`,
              value: creationData.videoUrl,
            }
            : undefined,
          links,
          highestCircleId: creationData.highestCircleId,
          advancedSettings: {
            permissionGovernanceId:
              creationData.advancedSettings?.permissionGovernanceId,
            circles: advancedSettingsCirclesPayload,
          },
        };
        const createdProject = await ProjectService.createNewProject(
          parentCommonId,
          payload,
          isAdvancedSettingsEnabled
        );
        setProject(createdProject);
      } catch (error) {
        const errorMessage =
          isRequestError(error) &&
            error.response?.data?.errorCode === ErrorCode.ArgumentDuplicatedError
            ? `Space with name "${creationData.spaceName}" already exists`
            : "Something went wrong...";

        Logger.error(error);
        setError(errorMessage);
      } finally {
        setIsProjectCreationLoading(false);
      }
    },
    [isProjectCreationLoading],
  );

  return {
    isProjectCreationLoading,
    project,
    error,
    createProject,
  };
};
