import React, { FC, useMemo } from "react";
import { ProjectService } from "@/services";
import { GovernanceActions } from "@/shared/constants";
import { useCommonsByDirectParentId } from "@/shared/hooks/useCases";
import { CommonMember, Governance } from "@/shared/models";
import {
  compareCommonsByLastActivity,
  generateCirclesDataForCommonMember,
} from "@/shared/utils";
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
  const parentCommonId = activeItem.directParent?.commonId;
  const hasParentPermissionToAddProject = useMemo(() => {
    const parentPermissions = permissionsData.find(
      (permissionsItem) =>
        permissionsItem.governance.commonId === parentCommonId,
    );

    return Boolean(
      parentPermissions &&
        generateCirclesDataForCommonMember(
          parentPermissions.governance.circles,
          parentPermissions.commonMemberCircleIds,
        ).allowedActions[GovernanceActions.CREATE_PROJECT],
    );
  }, [parentCommonId, permissionsData]);
  const projectsData = useMemo<ProjectsStateItem[]>(() => {
    const projectsInfo = ProjectService.parseDataToProjectsInfo(
      commons || [],
      userCommonIds,
      permissionsData,
    );

    return projectsInfo
      .sort((prevItem, nextItem) => {
        if (prevItem.common.id === activeItem.id) {
          return -1;
        }
        if (nextItem.common.id === activeItem.id) {
          return 1;
        }

        return compareCommonsByLastActivity(prevItem.common, nextItem.common);
      })
      .map(({ common, hasMembership, hasPermissionToAddProject }) => ({
        commonId: common.id,
        image: common.image,
        name: common.name,
        directParent: common.directParent,
        hasMembership,
        hasPermissionToAddProject,
      }));
  }, [commons, userCommonIds, permissionsData, activeItem.id]);

  return (
    <BreadcrumbsItem
      activeItem={activeItem}
      items={projectsData}
      commonIdToAddProject={
        hasParentPermissionToAddProject ? parentCommonId : null
      }
      {...restProps}
    />
  );
};

export default FeedBreadcrumbsItem;
