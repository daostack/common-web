import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { CommonEvent, CommonEventEmitter } from "@/events";
import { authentificated, selectUser } from "@/pages/Auth/store/selectors";
import { CommonService, GovernanceService, Logger } from "@/services";
import { GovernanceActions } from "@/shared/constants";
import { useRoutesContext } from "@/shared/contexts";
import { Common } from "@/shared/models";
import { generateCirclesDataForCommonMember } from "@/shared/utils";
import {
  commonLayoutActions,
  ProjectsStateItem,
  selectCommonLayoutCommonId,
  selectCommonLayoutCommonsState,
  selectCommonLayoutProjectsState,
} from "@/store/states";
import {
  generateProjectsTreeItems,
  getActiveItemIdByPath,
  getItemById,
  getItemFromProjectsStateItem,
  getItemIdWithNewProjectCreationByPath,
  getParentItemIds,
  Item,
} from "../../../../SidenavLayout/components/SidenavContent/components";

interface Return {
  currentCommonId: string | null;
  parentItem: Item | null;
  areCommonsLoading: boolean;
  areProjectsLoading: boolean;
  commons: ProjectsStateItem[];
  items: Item[];
  activeItem: Item | null;
  itemIdWithNewProjectCreation: string;
  parentItemIds: string[];
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

export const useProjectsData = (): Return => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = history.location;
  const { getCommonPagePath } = useRoutesContext();
  const isAuthenticated = useSelector(authentificated());
  const currentCommonId = useSelector(selectCommonLayoutCommonId);
  const { commons, areCommonsLoading, areCommonsFetched } = useSelector(
    selectCommonLayoutCommonsState,
  );
  const { projects, areProjectsLoading, areProjectsFetched } = useSelector(
    selectCommonLayoutProjectsState,
  );
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const [updatedItemsQueue, setUpdatedItemsQueue] = useState<Common[][]>([]);
  const nextUpdatedItems = updatedItemsQueue[0];
  const currentCommon = commons.find(
    ({ commonId }) => commonId === currentCommonId,
  );
  const generateItemCommonPagePath = useCallback(
    (projectsStateItem: ProjectsStateItem): string =>
      getCommonPagePath(projectsStateItem.commonId),
    [getCommonPagePath],
  );
  const parentItem = useMemo(
    () =>
      currentCommon
        ? getItemFromProjectsStateItem(
            currentCommon,
            generateItemCommonPagePath,
          )
        : null,
    [currentCommon, generateItemCommonPagePath],
  );
  const items = useMemo(() => {
    const [item] = generateProjectsTreeItems(
      currentCommon ? projects.concat(currentCommon) : projects,
      generateItemCommonPagePath,
    );

    return item?.items || [];
  }, [currentCommon, projects, generateItemCommonPagePath]);
  const activeItemId = getActiveItemIdByPath(location.pathname);
  const activeItem = getItemById(
    activeItemId,
    parentItem ? [parentItem, ...items] : items,
  );
  const parentItemIds = getParentItemIds(
    activeItemId,
    currentCommon ? projects.concat(currentCommon) : projects,
  );
  const itemIdWithNewProjectCreation = getItemIdWithNewProjectCreationByPath(
    location.pathname,
  );

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(commonLayoutActions.markDataAsNotFetched());
      return;
    }
    if (activeItemId) {
      dispatch(commonLayoutActions.clearDataExceptOfCurrent(activeItemId));
    } else {
      dispatch(commonLayoutActions.clearData());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (areCommonsLoading) {
      return;
    }
    if (!areCommonsFetched) {
      dispatch(commonLayoutActions.getCommons.request(activeItemId));
    }
  }, [areCommonsLoading, areCommonsFetched]);

  useEffect(() => {
    if (areProjectsLoading || !currentCommonId) {
      return;
    }
    if (!areProjectsFetched) {
      dispatch(commonLayoutActions.getProjects.request(currentCommonId));
    }
  }, [areProjectsLoading, areProjectsFetched, currentCommonId]);

  useEffect(() => {
    if (
      currentCommonId === activeItemId ||
      !commons.some((common) => common.commonId === activeItemId)
    ) {
      return;
    }

    dispatch(commonLayoutActions.setCurrentCommonId(activeItemId));
    dispatch(commonLayoutActions.clearProjects());
  }, [activeItemId]);

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

  return {
    currentCommonId,
    parentItem,
    areCommonsLoading,
    areProjectsLoading,
    commons,
    items,
    activeItem,
    itemIdWithNewProjectCreation,
    parentItemIds,
  };
};
