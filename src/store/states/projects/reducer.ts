import produce from "immer";
import { WritableDraft } from "immer/dist/types/types-external";
import { ActionType, createReducer } from "typesafe-actions";
import * as actions from "./actions";
import { ProjectsState } from "./types";
import { getAllNestedItems, getRelatedToIdItems } from "./utils";

type Action = ActionType<typeof actions>;

const initialState: ProjectsState = {
  data: [],
  isDataLoading: false,
  isDataFetched: false,
};

const clearProjects = (state: WritableDraft<ProjectsState>): void => {
  state.data = [];
  state.isDataLoading = false;
  state.isDataFetched = false;
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
  .handleAction(actions.addProject, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.data.push(payload);
    }),
  )
  .handleAction(actions.updateProject, (state, { payload }) =>
    produce(state, (nextState) => {
      const itemIndex = nextState.data.findIndex(
        (item) => item.commonId === payload.commonId,
      );

      if (itemIndex > -1) {
        nextState.data[itemIndex] = {
          ...nextState.data[itemIndex],
          ...payload,
        };
      }
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
  );
