import produce from "immer";
import { WritableDraft } from "immer/dist/types/types-external";
import { ActionType, createReducer } from "typesafe-actions";
import { getAllNestedItems } from "../projects/utils";
import * as actions from "./actions";
import { CommonLayoutState, ProjectsStateItem } from "./types";

type Action = ActionType<typeof actions>;

const initialState: CommonLayoutState = {
  currentCommonId: null,
  lastCommonFromFeed: null,
  commons: [],
  areCommonsLoading: false,
  areCommonsFetched: false,
  projects: [],
  areProjectsLoading: false,
  areProjectsFetched: false,
};

const clearData = (state: WritableDraft<CommonLayoutState>): void => {
  state.commons = [];
  state.areCommonsLoading = false;
  state.areCommonsFetched = false;
  state.projects = [];
  state.areProjectsLoading = false;
  state.areProjectsFetched = false;
};

const updateCommonOrProject = (
  state: WritableDraft<CommonLayoutState>,
  payload: { commonId: string } & Partial<Omit<ProjectsStateItem, "commonId">>,
  removeIfExists = false,
): boolean => {
  const commonItemIndex = state.commons.findIndex(
    (item) => item.commonId === payload.commonId,
  );

  if (commonItemIndex > -1) {
    if (removeIfExists) {
      state.commons.splice(commonItemIndex, 1);
    } else {
      state.commons[commonItemIndex] = {
        ...state.commons[commonItemIndex],
        ...payload,
      };
    }
    return true;
  }

  const projectItemIndex = state.projects.findIndex(
    (item) => item.commonId === payload.commonId,
  );

  if (projectItemIndex > -1) {
    if (removeIfExists) {
      state.projects.splice(projectItemIndex, 1);
    } else {
      state.projects[projectItemIndex] = {
        ...state.projects[projectItemIndex],
        ...payload,
      };
    }
    return true;
  }

  return false;
};

export const reducer = createReducer<CommonLayoutState, Action>(initialState)
  .handleAction(actions.getCommons.request, (state) =>
    produce(state, (nextState) => {
      nextState.areCommonsLoading = true;
    }),
  )
  .handleAction(actions.getCommons.success, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.currentCommonId =
        payload.currentCommonId || payload.data[0]?.commonId || null;
      nextState.commons = [...payload.data];
      nextState.areCommonsLoading = false;
      nextState.areCommonsFetched = true;
    }),
  )
  .handleAction(actions.getCommons.failure, (state) =>
    produce(state, (nextState) => {
      nextState.commons = [];
      nextState.areCommonsLoading = false;
      nextState.areCommonsFetched = true;
    }),
  )
  .handleAction(actions.getProjects.request, (state) =>
    produce(state, (nextState) => {
      nextState.areProjectsLoading = true;
    }),
  )
  .handleAction(actions.getProjects.success, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.projects = [...payload];
      nextState.areProjectsLoading = false;
      nextState.areProjectsFetched = true;
    }),
  )
  .handleAction(actions.getProjects.failure, (state) =>
    produce(state, (nextState) => {
      nextState.projects = [];
      nextState.areProjectsLoading = false;
      nextState.areProjectsFetched = true;
    }),
  )
  .handleAction(actions.addOrUpdateProject, (state, { payload }) =>
    produce(state, (nextState) => {
      const isUpdated = updateCommonOrProject(nextState, payload);

      if (isUpdated) {
        return;
      }

      if (!payload.directParent) {
        nextState.commons.push(payload);
      } else {
        nextState.projects.push(payload);
      }
    }),
  )
  .handleAction(actions.updateCommonOrProject, (state, { payload }) =>
    produce(state, (nextState) => {
      updateCommonOrProject(nextState, payload);
    }),
  )
  .handleAction(actions.setCurrentCommonId, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.currentCommonId = payload;
    }),
  )
  .handleAction(actions.setLastCommonFromFeed, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.lastCommonFromFeed = payload && {
        ...payload,
        data:
          nextState.lastCommonFromFeed?.id === payload.id && !payload.data
            ? nextState.lastCommonFromFeed?.data
            : payload.data,
      };
    }),
  )
  .handleAction(actions.clearData, (state) =>
    produce(state, (nextState) => {
      clearData(nextState);
    }),
  )
  .handleAction(
    actions.clearDataExceptOfCurrent,
    (state, { payload: commonId }) =>
      produce(state, (nextState) => {
        const currentItem = nextState.commons.find(
          (item) => item.commonId === commonId,
        );
        if (!currentItem) {
          clearData(nextState);
          return;
        }

        nextState.commons = [
          {
            ...currentItem,
            hasMembership: false,
          },
        ];
        nextState.projects = nextState.projects.map((item) => ({
          ...item,
          hasMembership: false,
        }));
      }),
  )
  .handleAction(actions.clearProjects, (state) =>
    produce(state, (nextState) => {
      nextState.projects = [];
      nextState.areProjectsLoading = false;
      nextState.areProjectsFetched = false;
    }),
  )
  .handleAction(actions.markDataAsNotFetched, (state) =>
    produce(state, (nextState) => {
      nextState.areCommonsFetched = false;
      nextState.areProjectsFetched = false;
    }),
  )
  .handleAction(
    actions.removeMembershipFromItemAndChildren,
    (state, { payload: commonId }) =>
      produce(state, (nextState) => {
        const currentCommonItem = nextState.commons.find(
          (item) => item.commonId === commonId,
        );
        const currentItem =
          currentCommonItem ||
          nextState.projects.find((item) => item.commonId === commonId);

        if (!currentItem) {
          return;
        }

        const itemsToChange = [
          currentItem,
          ...getAllNestedItems(currentItem, nextState.projects),
        ];

        itemsToChange.forEach((item) => {
          item.hasMembership = false;
        });
      }),
  )
  .handleAction(actions.deleteCommon, (state, { payload }) =>
    produce(state, (nextState) => {
      updateCommonOrProject(nextState, payload, true);
    }),
  );
