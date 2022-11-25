import produce from "immer";
import { ActionType, createReducer } from "typesafe-actions";
import { ProjectsState } from "@/store/states";
import * as actions from "./actions";
import { generateProjectsStateItems } from "./utils";

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
      const { commons } = payload;

      nextState.data = generateProjectsStateItems(commons);
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
  );
