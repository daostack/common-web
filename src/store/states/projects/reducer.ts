import produce from "immer";
import { ActionType, createReducer } from "typesafe-actions";
import { ProjectsState } from "@/store/states";
import * as actions from "./actions";

type Action = ActionType<typeof actions>;

const initialState: ProjectsState = {
  data: [],
  isDataLoading: false,
  isDataFetched: false,
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
      nextState.data = [];
      nextState.isDataLoading = false;
      nextState.isDataFetched = false;
    }),
  );
