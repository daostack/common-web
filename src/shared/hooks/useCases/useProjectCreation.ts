import { useCallback, useState } from "react";
import { Logger, ProjectService } from "@/services";
import {
  CreateProjectPayload,
  IntermediateCreateProjectPayload,
} from "@/shared/interfaces";
import { Common } from "@/shared/models";
import { getFileDownloadInfo, getFilesDownloadInfo } from "@/shared/utils";

interface Return {
  isProjectCreationLoading: boolean;
  project: Common | null;
  error: string;
  createProject: (
    parentCommonId: string,
    creationData: IntermediateCreateProjectPayload,
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
    ) => {
      const [projectImageFile] = creationData.projectImages;

      if (isProjectCreationLoading || !projectImageFile) {
        return;
      }

      setIsProjectCreationLoading(true);

      try {
        const [projectImage, gallery] = await Promise.all([
          getFileDownloadInfo(projectImageFile),
          getFilesDownloadInfo(creationData.gallery),
        ]);
        const payload: CreateProjectPayload = {
          name: creationData.projectName,
          byline: creationData.byline,
          description: creationData.description
            ? JSON.stringify(creationData.description)
            : "",
          image: projectImage.value,
          gallery,
          video: creationData.videoUrl
            ? {
                title: `Project ${creationData.projectName} Video`,
                value: creationData.videoUrl,
              }
            : undefined,
          highestCircleId: creationData.highestCircleId,
        };
        const createdProject = await ProjectService.createNewProject(
          parentCommonId,
          payload,
        );
        setProject(createdProject);
      } catch (error) {
        Logger.error(error);
        setError("Something went wrong...");
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
