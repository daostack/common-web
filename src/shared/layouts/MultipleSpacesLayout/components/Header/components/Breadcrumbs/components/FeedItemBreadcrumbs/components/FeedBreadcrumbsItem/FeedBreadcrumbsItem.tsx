import React, { FC, useMemo } from "react";
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
  "activeItem" | "onCommonCreate" | "withMenu" | "onClick"
>;

const getItemsByParentId = (
  parentId: string,
  data: ProjectsStateItem[],
): ProjectsStateItem[] =>
  data.filter((item) => item.directParent?.commonId === parentId);

const FeedBreadcrumbsItem: FC<FeedBreadcrumbsItemProps> = (props) => {
  const { activeItem, ...restProps } = props;
  const { commons, areCommonsFetched } = useSelector(
    selectCommonLayoutCommonsState,
  );
  const { projects, areProjectsFetched } = useSelector(
    selectCommonLayoutProjectsState,
  );
  const parentCommonId = activeItem.directParent?.commonId;
  const baseItems = useMemo(
    () =>
      parentCommonId ? getItemsByParentId(parentCommonId, projects) : commons,
    [parentCommonId, projects, commons],
  );
  const areItemsLoading = parentCommonId
    ? !areProjectsFetched
    : !areCommonsFetched;
  const hasParentPermissionToAddProject = useMemo(
    () =>
      (parentCommonId &&
        (
          commons.find((item) => item.commonId === parentCommonId) ||
          projects.find((item) => item.commonId === parentCommonId)
        )?.hasPermissionToAddProject) ??
      false,
    [commons, projects, parentCommonId],
  );
  const items = useMemo(
    () =>
      baseItems.length === 0
        ? [activeItem]
        : [...baseItems].sort((prevItem, nextItem) => {
            if (prevItem.commonId === activeItem.commonId) {
              return -1;
            }
            if (nextItem.commonId === activeItem.commonId) {
              return 1;
            }

            return 0;
          }),
    [baseItems, activeItem],
  );

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
