import React, { FC, useCallback } from "react";
import { Item } from "@/shared/layouts/SidenavLayout/components/SidenavContent/components";
import { ProjectsStateItem } from "@/store/states";
import { NameRightContent } from "../../../LinkStreamModal/components/LinkStreamProjects/components";
import { Projects, ProjectsProps } from "../../../Projects";

interface MoveStreamProjectsProps
  extends Omit<ProjectsProps, "getAdditionalItemData"> {
  originalCommonId: string;
  circleVisibility: string[];
}

const MoveStreamProjects: FC<MoveStreamProjectsProps> = (props) => {
  const { rootCommonId, originalCommonId, circleVisibility } = props;

  const getAdditionalItemData = useCallback(
    (projectsStateItem: ProjectsStateItem): Partial<Item> => {
      const isAllowedToMove =
        circleVisibility.length === 0 ||
        projectsStateItem.commonId === rootCommonId ||
        projectsStateItem.rootCommonId === rootCommonId;

      return {
        disabled:
          !isAllowedToMove ||
          !projectsStateItem.hasPermissionToMoveToHere ||
          projectsStateItem.commonId === originalCommonId,
        nameRightContent: (
          <NameRightContent
            projectsStateItem={projectsStateItem}
            originalCommonId={originalCommonId}
          />
        ),
      };
    },
    [originalCommonId, rootCommonId, circleVisibility],
  );

  return <Projects {...props} getAdditionalItemData={getAdditionalItemData} />;
};

export default MoveStreamProjects;
