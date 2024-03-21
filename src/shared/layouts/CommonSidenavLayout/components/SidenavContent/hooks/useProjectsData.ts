import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { selectIsAuthenticated } from "@/pages/Auth/store/selectors";
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
import { useProjectsSubscription } from "./useProjectsSubscription";

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
  const isAuthenticated = useSelector(selectIsAuthenticated());
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
    const filteredProjects = projects.filter((project) => project.hasAccessToSpace && Boolean(project.directParent));

    const [item] = generateProjectsTreeItems(
      currentCommon ? filteredProjects.concat(currentCommon) : filteredProjects,
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
  useProjectsSubscription({
    activeItemId,
    areProjectsFetched,
    commons,
    projects,
  });

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
    if (!areCommonsFetched) {
      dispatch(commonLayoutActions.getCommons.request(activeItemId));
    }
  }, [areCommonsFetched]);

  useEffect(() => {
    if (currentCommonId && !areProjectsFetched) {
      dispatch(commonLayoutActions.getProjects.request(currentCommonId));
    }
  }, [areProjectsFetched, currentCommonId]);

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
