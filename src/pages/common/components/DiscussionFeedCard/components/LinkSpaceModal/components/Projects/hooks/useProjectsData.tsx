import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useLoadingState } from "@/shared/hooks";
import {
  generateProjectsTreeItems,
  getItemById,
  getItemFromProjectsStateItem,
  getParentItemIds,
  Item,
} from "@/shared/layouts/SidenavLayout/components/SidenavContent/components";
import {
  ProjectsStateItem,
  selectCommonLayoutCommonsState,
} from "@/store/states";
import { getProjects as getProjectsUtil } from "@/store/states/commonLayout/saga/utils";
import { NameRightContent } from "./components";

interface ProjectsInfo {
  currentCommonId: string;
  activeItemId: string;
  originalCommonId: string;
  linkedCommonIds: string[];
}

interface Return {
  parentItem: Item | null;
  areCommonsLoading: boolean;
  areProjectsLoading: boolean;
  commons: ProjectsStateItem[];
  items: Item[];
  activeItem: Item | null;
  parentItemIds: string[];
}

const generateItemCommonPagePath = () => "";

export const useProjectsData = (projectsInfo: ProjectsInfo): Return => {
  const { currentCommonId, activeItemId, originalCommonId, linkedCommonIds } =
    projectsInfo;
  const currentCommonIdRef = useRef(currentCommonId);
  currentCommonIdRef.current = currentCommonId;
  const { commons, areCommonsLoading } = useSelector(
    selectCommonLayoutCommonsState,
  );
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const [{ data: projects, loading: areProjectsLoading }, setProjectsState] =
    useLoadingState<ProjectsStateItem[]>([]);
  const currentCommon = commons.find(
    ({ commonId }) => commonId === currentCommonId,
  );

  const getAdditionalItemData = useCallback(
    (projectsStateItem: ProjectsStateItem): Partial<Item> => ({
      disabled:
        !projectsStateItem.hasPermissionToLinkToHere ||
        projectsStateItem.commonId === originalCommonId ||
        linkedCommonIds.includes(projectsStateItem.commonId),
      nameRightContent: (
        <NameRightContent
          projectsStateItem={projectsStateItem}
          originalCommonId={originalCommonId}
          linkedCommonIds={linkedCommonIds}
        />
      ),
    }),
    [originalCommonId, linkedCommonIds],
  );

  const parentItem = useMemo(
    () =>
      currentCommon
        ? getItemFromProjectsStateItem(
            currentCommon,
            generateItemCommonPagePath,
            undefined,
            getAdditionalItemData,
          )
        : null,
    [currentCommon, getAdditionalItemData],
  );
  const items = useMemo(() => {
    const [item] = generateProjectsTreeItems(
      currentCommon ? projects.concat(currentCommon) : projects,
      generateItemCommonPagePath,
      getAdditionalItemData,
    );

    return item?.items || [];
  }, [currentCommon, projects, getAdditionalItemData]);
  const activeItem = getItemById(
    activeItemId,
    parentItem ? [parentItem, ...items] : items,
  );
  const parentItemIds = getParentItemIds(
    activeItemId,
    currentCommon ? projects.concat(currentCommon) : projects,
  );

  useEffect(() => {
    let isRelevantLoading = true;

    (async () => {
      try {
        setProjectsState({
          data: [],
          loading: true,
          fetched: false,
        });
        const projectsData = await getProjectsUtil(currentCommonId, userId);

        if (isRelevantLoading) {
          setProjectsState({
            data: projectsData,
            loading: false,
            fetched: true,
          });
        }
      } catch (err) {
        if (isRelevantLoading) {
          setProjectsState({
            data: [],
            loading: false,
            fetched: true,
          });
        }
      }
    })();

    return () => {
      isRelevantLoading = false;
    };
  }, [currentCommonId]);

  return {
    parentItem,
    areCommonsLoading,
    areProjectsLoading,
    commons,
    items,
    activeItem,
    parentItemIds,
  };
};
