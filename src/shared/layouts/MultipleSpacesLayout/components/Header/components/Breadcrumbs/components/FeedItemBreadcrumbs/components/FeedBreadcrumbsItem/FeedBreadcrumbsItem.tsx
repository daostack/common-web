import React, { FC, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  ProjectsStateItem,
  selectCommonLayoutCommonsState,
  selectCommonLayoutProjectsState,
} from "@/store/states";
import {
  BreadcrumbsItem,
  BreadcrumbsItemProps,
} from "../../../BreadcrumbsItem";

type FeedBreadcrumbsItemProps = Pick<
  BreadcrumbsItemProps,
  "activeItem" | "onCommonCreate" | "withMenu" | "onClick" | "truncate"
>;

const getItemsByParentId = (
  parentId: string,
  data: ProjectsStateItem[],
): ProjectsStateItem[] =>
  data.filter((item) => item.directParent?.commonId === parentId);

const FeedBreadcrumbsItem: FC<FeedBreadcrumbsItemProps> = ({
  activeItem,
  ...restProps
}) => {
  const { commons, areCommonsFetched } = useSelector(
    selectCommonLayoutCommonsState,
  );
  const { projects, areProjectsFetched } = useSelector(
    selectCommonLayoutProjectsState,
  );

  const parentCommonId = activeItem.directParent?.commonId;

  const baseItems = useMemo(() => {
    return parentCommonId
      ? getItemsByParentId(parentCommonId, projects)
      : commons;
  }, [parentCommonId, projects, commons]);

  const areItemsLoading = parentCommonId
    ? !areProjectsFetched
    : !areCommonsFetched;

  const hasParentPermissionToAddProject = useMemo(() => {
    if (!parentCommonId) return false;

    const parentItem =
      commons.find((item) => item.commonId === parentCommonId) ||
      projects.find((item) => item.commonId === parentCommonId);

    return parentItem?.hasPermissionToAddProject ?? false;
  }, [commons, projects, parentCommonId]);

  const items = useMemo(() => {
    if (baseItems.length === 0) {
      return [activeItem];
    }
    return [...baseItems].sort((prevItem, nextItem) => {
      if (prevItem.commonId === activeItem.commonId) return -1;
      if (nextItem.commonId === activeItem.commonId) return 1;
      return 0;
    });
  }, [baseItems, activeItem]);

  return (
    <BreadcrumbsItem
      activeItem={activeItem}
      items={items}
      commonIdToAddProject={
        hasParentPermissionToAddProject ? parentCommonId : null
      }
      isLoading={areItemsLoading}
      {...restProps}
    />
  );
};

export default FeedBreadcrumbsItem;
