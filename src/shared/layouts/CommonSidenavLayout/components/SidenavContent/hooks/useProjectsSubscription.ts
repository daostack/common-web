import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePreviousDistinct } from "react-use";
import { CommonEvent, CommonEventEmitter } from "@/events";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  CommonService,
  GovernanceService,
  Logger,
  UserService,
} from "@/services";
import { GovernanceActions } from "@/shared/constants";
import { SpaceListVisibility } from "@/shared/interfaces";
import { Common } from "@/shared/models";
import { generateCirclesDataForCommonMember } from "@/shared/utils";
import { commonLayoutActions, ProjectsStateItem } from "@/store/states";

interface Data {
  currentCommonId: string | null;
  activeItemId: string;
  areProjectsFetched: boolean;
  commons: ProjectsStateItem[];
  projects: ProjectsStateItem[];
}

const getProjectItemFromCommon = async (
  common: Common,
  userId?: string,
  initialItem?: ProjectsStateItem,
): Promise<ProjectsStateItem> => {
  const baseItem: Omit<
    ProjectsStateItem,
    "hasMembership" | "hasPermissionToAddProject"
  > = {
    commonId: common.id,
    image: common.image,
    name: common.name,
    directParent: common.directParent,
    rootCommonId: common.rootCommonId,
    listVisibility: common.listVisibility,
  };

  if (initialItem) {
    return {
      ...baseItem,
      hasMembership: initialItem.hasMembership,
      hasPermissionToAddProject: initialItem.hasPermissionToAddProject,
    };
  }
  if (!userId) {
    return {
      ...baseItem,
      hasMembership: false,
      hasPermissionToAddProject: false,
      hasAccessToSpace:
        !common.listVisibility ||
        common.listVisibility === SpaceListVisibility.Public,
    };
  }

  const [governance, commonMember] = await Promise.all([
    GovernanceService.getGovernanceByCommonId(common.id),
    CommonService.getCommonMemberByUserId(common.id, userId),
  ]);

  const hasMembership = Boolean(commonMember);

  return {
    ...baseItem,
    hasMembership,
    hasAccessToSpace:
      hasMembership ||
      !common.listVisibility ||
      common.listVisibility === SpaceListVisibility.Public,
    hasPermissionToAddProject: Boolean(
      governance &&
        commonMember &&
        generateCirclesDataForCommonMember(
          governance.circles,
          commonMember.circleIds,
        ).allowedActions[GovernanceActions.CREATE_PROJECT],
    ),
  };
};

export const useProjectsSubscription = (data: Data) => {
  const {
    currentCommonId,
    activeItemId,
    areProjectsFetched,
    commons,
    projects,
  } = data;
  const dispatch = useDispatch();
  const [updatedItemsQueue, setUpdatedItemsQueue] = useState<Common[][]>([]);
  const [isCurrentCommonMember, setIsCurrentCommonMember] = useState<
    boolean | null
  >(null);
  const previousIsCurrentCommonMember = usePreviousDistinct(
    isCurrentCommonMember,
  );
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const nextUpdatedItems = updatedItemsQueue[0];

  useEffect(() => {
    if (!areProjectsFetched) {
      return;
    }

    const unsubscribe = CommonService.subscribeToSubCommons(
      activeItemId,
      (data, fromCache) => {
        if (fromCache) {
          return;
        }

        const commons = data.reduce<Common[]>((acc, { common, isRemoved }) => {
          if (isRemoved) {
            CommonEventEmitter.emit(CommonEvent.CommonDeleted, common.id);
            return acc;
          } else {
            CommonEventEmitter.emit(CommonEvent.CommonUpdated, common);
            return acc.concat(common);
          }
        }, []);

        if (commons.length !== 0) {
          setUpdatedItemsQueue((currentItems) =>
            currentItems.concat([commons]),
          );
        }
      },
    );

    return unsubscribe;
  }, [areProjectsFetched, activeItemId]);

  useEffect(() => {
    if (!nextUpdatedItems) {
      return;
    }
    if (nextUpdatedItems.length === 0) {
      setUpdatedItemsQueue((currentItems) => currentItems.slice(1));
      return;
    }

    (async () => {
      try {
        const items = await Promise.all(
          nextUpdatedItems.map(async (nextUpdatedItem) => {
            const existingItem =
              commons.find((item) => item.commonId === nextUpdatedItem.id) ||
              projects.find((item) => item.commonId === nextUpdatedItem.id);

            return await getProjectItemFromCommon(
              nextUpdatedItem,
              userId,
              existingItem,
            );
          }),
        );

        items.forEach((item) => {
          CommonEventEmitter.emit(CommonEvent.ProjectCreatedOrUpdated, item);
        });
      } catch (error) {
        Logger.error(error);
      } finally {
        setUpdatedItemsQueue((currentItems) => currentItems.slice(1));
      }
    })();
  }, [nextUpdatedItems]);

  useEffect(() => {
    setIsCurrentCommonMember(null);

    if (!userId || !currentCommonId) {
      return;
    }

    const unsubscribe = UserService.subscribeToUserMemberships(
      userId,
      (userMemberships) => {
        setIsCurrentCommonMember(
          Boolean(userMemberships && userMemberships.commons[currentCommonId]),
        );
      },
    );

    return unsubscribe;
  }, [userId, currentCommonId]);

  useEffect(() => {
    if (
      typeof isCurrentCommonMember !== "boolean" ||
      typeof previousIsCurrentCommonMember !== "boolean"
    ) {
      return;
    }

    if (!previousIsCurrentCommonMember && isCurrentCommonMember) {
      dispatch(commonLayoutActions.clearProjects());
      return;
    }

    if (
      currentCommonId &&
      previousIsCurrentCommonMember &&
      !isCurrentCommonMember
    ) {
      dispatch(
        commonLayoutActions.removeMembershipFromProjectsByRootCommonId(
          currentCommonId,
        ),
      );
    }
  }, [isCurrentCommonMember]);
};
