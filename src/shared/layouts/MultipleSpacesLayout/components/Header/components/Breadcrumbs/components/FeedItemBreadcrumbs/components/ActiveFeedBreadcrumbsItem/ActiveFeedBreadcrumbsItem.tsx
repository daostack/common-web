import React, { FC, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  selectCommonLayoutCommonsState,
  selectCommonLayoutProjectsState,
} from "@/store/states";
import {
  ActiveBreadcrumbsItem,
  ActiveBreadcrumbsItemProps,
} from "../../../ActiveBreadcrumbsItem";

interface ActiveFeedBreadcrumbsItemProps
  extends Pick<
    ActiveBreadcrumbsItemProps,
    "name" | "image" | "withMenu" | "truncate"
  > {
  activeItemId: string;
}

const ActiveFeedBreadcrumbsItem: FC<ActiveFeedBreadcrumbsItemProps> = (
  props,
) => {
  const { activeItemId, ...restProps } = props;
  const { commons, areCommonsFetched } = useSelector(
    selectCommonLayoutCommonsState,
  );
  const { projects: allProjects, areProjectsFetched } = useSelector(
    selectCommonLayoutProjectsState,
  );
  const projects = useMemo(
    () => allProjects.filter((project) => project.hasAccessToSpace),
    [allProjects],
  );
  const baseItems = useMemo(
    () =>
      projects.filter(
        (project) => project.directParent?.commonId === activeItemId,
      ),
    [projects, activeItemId],
  );
  const areItemsLoading = !areCommonsFetched || !areProjectsFetched;
  const hasPermissionToAddProject = useMemo(
    () =>
      (
        commons.find((item) => item.commonId === activeItemId) ||
        projects.find((item) => item.commonId === activeItemId)
      )?.hasPermissionToAddProject ?? false,
    [commons, projects, activeItemId],
  );
  const items = useMemo(
    () =>
      [...baseItems].sort((prevItem) =>
        prevItem.commonId === activeItemId ? -1 : 1,
      ),
    [baseItems, activeItemId],
  );

  return (
    <ActiveBreadcrumbsItem
      {...restProps}
      items={items}
      commonIdToAddProject={hasPermissionToAddProject ? activeItemId : null}
      isLoading={areItemsLoading}
    />
  );
};

export default ActiveFeedBreadcrumbsItem;
