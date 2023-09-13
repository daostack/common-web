import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CommonEvent, CommonEventEmitter } from "@/events";
import { selectUser } from "@/pages/Auth/store/selectors";
import { CommonService, GovernanceService, Logger } from "@/services";
import { GovernanceActions } from "@/shared/constants";
import { Common } from "@/shared/models";
import { generateCirclesDataForCommonMember } from "@/shared/utils";
import { ProjectsStateItem } from "@/store/states";

interface Data {
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
    };
  }

  const [governance, commonMember] = await Promise.all([
    GovernanceService.getGovernanceByCommonId(common.id),
    CommonService.getCommonMemberByUserId(common.id, userId),
  ]);

  return {
    ...baseItem,
    hasMembership: Boolean(commonMember),
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
  const { activeItemId, areProjectsFetched, commons, projects } = data;
  const [updatedItemsQueue, setUpdatedItemsQueue] = useState<Common[][]>([]);
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const nextUpdatedItems = updatedItemsQueue[0];

  useEffect(() => {
    if (!areProjectsFetched) {
      return;
    }

    const unsubscribe = CommonService.subscribeToSubCommons(
      activeItemId,
      (data) => {
        const commons = data.reduce<Common[]>((acc, { common, isRemoved }) => {
          if (!isRemoved) {
            CommonEventEmitter.emit(CommonEvent.CommonUpdated, common);
            return acc.concat(common);
          }

          return acc;
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
};
