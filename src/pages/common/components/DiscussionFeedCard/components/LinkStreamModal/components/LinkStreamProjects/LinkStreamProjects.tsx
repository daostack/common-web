import React, { FC, useCallback } from "react";
import { Item } from "@/shared/layouts/SidenavLayout/components/SidenavContent/components";
import { ProjectsStateItem } from "@/store/states";
import { Projects, ProjectsProps } from "../Projects";
import { NameRightContent } from "./components";

interface LinkStreamProjects
  extends Omit<ProjectsProps, "getAdditionalItemData"> {
  originalCommonId: string;
  linkedCommonIds: string[];
  circleVisibility: string[];
}

const LinkStreamProjects: FC<LinkStreamProjects> = (props) => {
  const { rootCommonId, originalCommonId, linkedCommonIds, circleVisibility } =
    props;

  const getAdditionalItemData = useCallback(
    (projectsStateItem: ProjectsStateItem): Partial<Item> => {
      const isAllowedToLink =
        circleVisibility.length === 0 ||
        projectsStateItem.commonId === rootCommonId ||
        projectsStateItem.rootCommonId === rootCommonId;

      return {
        disabled:
          !isAllowedToLink ||
          !projectsStateItem.hasPermissionToLinkToHere ||
          projectsStateItem.commonId === originalCommonId ||
          linkedCommonIds.includes(projectsStateItem.commonId),
        nameRightContent: (
          <NameRightContent
            projectsStateItem={projectsStateItem}
            originalCommonId={originalCommonId}
            linkedCommonIds={linkedCommonIds}
          />
        ),
      };
    },
    [originalCommonId, linkedCommonIds, rootCommonId, circleVisibility],
  );

  return <Projects {...props} getAdditionalItemData={getAdditionalItemData} />;
};

export default LinkStreamProjects;
