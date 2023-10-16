import { ProjectsStateItem } from "@/store/states";

interface Return {
  data: {
    activeCommonId: string;
    items: ProjectsStateItem[];
    commonIdToAddProject?: string | null;
  }[];
  projects: ProjectsStateItem[];
  hasPermissionToAddProjectInActiveCommon?: boolean;
}

const getSortFn = (
  activeCommonId: string,
): ((item: ProjectsStateItem) => number) => {
  return (item) => (item.commonId === activeCommonId ? -1 : 1);
};

export const getBreadcrumbsData = (
  items: ProjectsStateItem[],
  activeCommonId: string,
): Return => {
  const activeCommon = items.find((item) => item.commonId === activeCommonId);

  if (!activeCommon) {
    return {
      data: [],
      projects: [],
      hasPermissionToAddProjectInActiveCommon: false,
    };
  }

  const mainLevelCommons = items
    .filter((item) => !item.directParent)
    .sort(getSortFn(activeCommonId));
  const activeCommonProjects = items.filter(
    (item) => item.directParent?.commonId === activeCommonId,
  );

  if (!activeCommon.directParent) {
    return {
      data: [
        {
          activeCommonId,
          items: mainLevelCommons,
        },
      ],
      projects: activeCommonProjects,
      hasPermissionToAddProjectInActiveCommon:
        activeCommon.hasPermissionToAddProject,
    };
  }

  let parentCommon = items.find(
    (item) => item.commonId === activeCommon.directParent?.commonId,
  );

  if (!parentCommon) {
    return {
      data: [],
      projects: [],
      hasPermissionToAddProjectInActiveCommon: false,
    };
  }

  const data: Return["data"] = [];
  let activeCommonIdInParentCommonProjects = activeCommonId;

  while (parentCommon) {
    const parentCommonProjects = items
      .filter((item) => item.directParent?.commonId === parentCommon?.commonId)
      .sort(getSortFn(activeCommonIdInParentCommonProjects));

    data.unshift({
      activeCommonId: activeCommonIdInParentCommonProjects,
      items: parentCommonProjects,
      commonIdToAddProject: parentCommon.hasPermissionToAddProject
        ? parentCommon.commonId
        : null,
    });

    activeCommonIdInParentCommonProjects = parentCommon.commonId;
    parentCommon = items.find(
      (item) => item.commonId === parentCommon?.directParent?.commonId,
    );
  }

  data.unshift({
    activeCommonId: activeCommonIdInParentCommonProjects,
    items: mainLevelCommons.sort(
      getSortFn(activeCommonIdInParentCommonProjects),
    ),
  });

  return {
    data,
    projects: activeCommonProjects,
    hasPermissionToAddProjectInActiveCommon:
      activeCommon.hasPermissionToAddProject,
  };
};
