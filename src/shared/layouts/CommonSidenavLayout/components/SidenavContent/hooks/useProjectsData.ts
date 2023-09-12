import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { CommonEvent, CommonEventEmitter } from "@/events";
import { authentificated } from "@/pages/Auth/store/selectors";
import { CommonService } from "@/services";
import { useRoutesContext } from "@/shared/contexts";
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
        data.forEach(({ common, isRemoved }) => {
          if (isRemoved) {
            return;
          }

          CommonEventEmitter.emit(CommonEvent.CommonUpdated, common);
          CommonEventEmitter.emit(CommonEvent.ProjectCreatedOrUpdated, {
            commonId: common.id,
            image: common.image,
            name: common.name,
            directParent: common.directParent,
            hasMembership: true,
            hasPermissionToAddProject: true,
            notificationsAmount: 0,
          });
        });
      },
    );

    return unsubscribe;
  }, [areProjectsFetched, activeItemId]);

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
