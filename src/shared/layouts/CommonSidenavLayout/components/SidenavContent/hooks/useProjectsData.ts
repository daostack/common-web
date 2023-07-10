import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { authentificated } from "@/pages/Auth/store/selectors";
import { useRoutesContext } from "@/shared/contexts";
import {
  commonLayoutActions,
  ProjectsStateItem,
  selectAreCommonLayoutCommonsFetched,
  selectAreCommonLayoutCommonsLoading,
  selectAreCommonLayoutProjectsFetched,
  selectAreCommonLayoutProjectsLoading,
  selectCommonLayoutCommonId,
  selectCommonLayoutCommons,
  selectCommonLayoutProjects,
} from "@/store/states";
import {
  generateProjectsTreeItems,
  getActiveItemIdByPath,
  getItemById,
  getItemFromProjectsStateItem,
  getItemIdWithNewProjectCreationByPath,
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
}

export const useProjectsData = (): Return => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = history.location;
  const { getCommonPagePath, getCommonPageAboutTabPath } = useRoutesContext();
  const isAuthenticated = useSelector(authentificated());
  const currentCommonId = useSelector(selectCommonLayoutCommonId);
  const commons = useSelector(selectCommonLayoutCommons);
  const areCommonsLoading = useSelector(selectAreCommonLayoutCommonsLoading);
  const areCommonsFetched = useSelector(selectAreCommonLayoutCommonsFetched);
  const projects = useSelector(selectCommonLayoutProjects);
  const areProjectsLoading = useSelector(selectAreCommonLayoutProjectsLoading);
  const areProjectsFetched = useSelector(selectAreCommonLayoutProjectsFetched);
  const currentCommon = commons.find(
    ({ commonId }) => commonId === currentCommonId,
  );
  const generateItemCommonPagePath = useCallback(
    (projectsStateItem: ProjectsStateItem): string =>
      projectsStateItem.hasMembership
        ? getCommonPagePath(projectsStateItem.commonId)
        : getCommonPageAboutTabPath(projectsStateItem.commonId),
    [getCommonPagePath, getCommonPageAboutTabPath],
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

  return {
    currentCommonId,
    parentItem,
    areCommonsLoading,
    areProjectsLoading,
    commons,
    items,
    activeItem,
    itemIdWithNewProjectCreation,
  };
};