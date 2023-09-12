import produce from "immer";
import { WritableDraft } from "immer/dist/types/types-external";
import { ActionType, createReducer } from "typesafe-actions";
import * as actions from "./actions";
import { ProjectsState, ProjectsStateItem } from "./types";
import { getAllNestedItems, getRelatedToIdItems } from "./utils";

type Action = ActionType<typeof actions>;

const initialState: ProjectsState = {
  data: [],
  isDataLoading: false,
  isDataFetched: false,
  isCommonCreationDisabled: false,
};

const clearProjects = (state: WritableDraft<ProjectsState>): void => {
  state.data = [];
  state.isDataLoading = false;
  state.isDataFetched = false;
};

const updateProject = (
  state: WritableDraft<ProjectsState>,
  payload: { commonId: string } & Partial<Omit<ProjectsStateItem, "commonId">>,
): boolean => {
  const itemIndex = state.data.findIndex(
    (item) => item.commonId === payload.commonId,
  );

  if (itemIndex > -1) {
    state.data[itemIndex] = {
      ...state.data[itemIndex],
      ...payload,
    };
    return true;
  }

  return false;
};

export const reducer = createReducer<ProjectsState, Action>(initialState)
  .handleAction(actions.getProjects.request, (state) =>
    produce(state, (nextState) => {
      nextState.isDataLoading = true;
    }),
  )
  .handleAction(actions.getProjects.success, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.data = [...payload];
      nextState.isDataLoading = false;
      nextState.isDataFetched = true;
    }),
  )
  .handleAction(actions.getProjects.failure, (state) =>
    produce(state, (nextState) => {
      nextState.data = [];
      nextState.isDataLoading = false;
      nextState.isDataFetched = true;
    }),
  )
  .handleAction(actions.addOrUpdateProject, (state, { payload }) =>
    produce(state, (nextState) => {
      const isUpdated = updateProject(nextState, payload);

      if (!isUpdated) {
        nextState.data.push(payload);
      }
    }),
  )
  .handleAction(actions.updateProject, (state, { payload }) =>
    produce(state, (nextState) => {
      updateProject(nextState, payload);
    }),
  )
  .handleAction(actions.clearProjects, (state) =>
    produce(state, (nextState) => {
      clearProjects(nextState);
    }),
  )
  .handleAction(
    actions.clearProjectsExceptOfCurrent,
    (state, { payload: commonId }) =>
      produce(state, (nextState) => {
        const hasItemToCheck = nextState.data.some(
          (item) => item.commonId === commonId,
        );
        if (!hasItemToCheck) {
          clearProjects(nextState);
          return;
        }

        nextState.data = getRelatedToIdItems(commonId, nextState.data).map(
          (item) => ({
            ...item,
            hasMembership: false,
          }),
        );
      }),
  )
  .handleAction(actions.markProjectsAsNotFetched, (state) =>
    produce(state, (nextState) => {
      nextState.isDataFetched = false;
    }),
  )
  .handleAction(
    actions.removeMembershipFromProjectAndChildren,
    (state, { payload: commonId }) =>
      produce(state, (nextState) => {
        const currentItem = nextState.data.find(
          (item) => item.commonId === commonId,
        );

        if (!currentItem) {
          return;
        }

        const itemsToChange = [
          currentItem,
          ...getAllNestedItems(currentItem, nextState.data),
        ];

        itemsToChange.forEach((item) => {
          item.hasMembership = false;
        });
      }),
  )
  .handleAction(actions.setIsCommonCreationDisabled, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.isCommonCreationDisabled = payload;
    }),
  );
