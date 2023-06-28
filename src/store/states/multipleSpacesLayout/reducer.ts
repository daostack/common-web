import produce from "immer";
import { cloneDeep } from "lodash";
import { ActionType, createReducer } from "typesafe-actions";
import * as actions from "./actions";
import { MultipleSpacesLayoutState } from "./types";

type Action = ActionType<typeof actions>;

const initialState: MultipleSpacesLayoutState = {
  breadcrumbs: null,
  previousBreadcrumbs: null,
};

export const reducer = createReducer<MultipleSpacesLayoutState, Action>(
  initialState,
)
  .handleAction(actions.resetMultipleSpacesLayout, () =>
    cloneDeep(initialState),
  )
  .handleAction(actions.setBreadcrumbsData, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.breadcrumbs = payload && { ...payload };
    }),
  );
