import React, { FC, useMemo } from "react";
import { ProjectService } from "@/services";
import { useCommonsByDirectParentId } from "@/shared/hooks/useCases";
import { CommonMember, Governance } from "@/shared/models";
import { compareCommonsByLastActivity } from "@/shared/utils";
import { ProjectsStateItem } from "@/store/states";
import { getPermissionsDataByAllUserCommonMemberInfo } from "@/store/states/commonLayout/saga/utils";
import {
  BreadcrumbsItem,
  BreadcrumbsItemProps,
} from "../../../BreadcrumbsItem";

interface FeedBreadcrumbsItemProps
  extends Pick<
    BreadcrumbsItemProps,
    "activeItem" | "onCommonCreate" | "withMenu"
  > {
  userCommonIds: string[];
  permissionsData: ReturnType<
    typeof getPermissionsDataByAllUserCommonMemberInfo
  >;
  governance?: Governance;
  commonMember?: CommonMember;
}

const FeedBreadcrumbsItem: FC<FeedBreadcrumbsItemProps> = (props) => {
  const {
    activeItem,
    userCommonIds,
    permissionsData,
    governance,
    commonMember,
    ...restProps
  } = props;
  const { data: commons } = useCommonsByDirectParentId(
    activeItem.directParent?.commonId,
  );
  const projectsData = useMemo<ProjectsStateItem[]>(() => {
    const projectsInfo = ProjectService.parseDataToProjectsInfo(
      commons || [],
      userCommonIds,
      permissionsData,
    );

    return projectsInfo
      .sort((prevItem, nextItem) =>
        compareCommonsByLastActivity(prevItem.common, nextItem.common),
      )
      .map(({ common, hasMembership, hasPermissionToAddProject }) => ({
        commonId: common.id,
        image: common.image,
        name: common.name,
        directParent: common.directParent,
        hasMembership,
        hasPermissionToAddProject,
      }));
  }, [commons, userCommonIds, permissionsData]);

  return (
    <BreadcrumbsItem
      activeItem={activeItem}
      items={projectsData}
      {...restProps}
    />
  );
};

export default FeedBreadcrumbsItem;
