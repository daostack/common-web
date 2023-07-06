import produce from "immer";
import { cloneDeep } from "lodash";
import { ActionType, createReducer } from "typesafe-actions";
import { InboxItemType } from "@/shared/constants";
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
  )
  .handleAction(actions.moveBreadcrumbsToPrevious, (state) =>
    produce(state, (nextState) => {
      nextState.previousBreadcrumbs = nextState.breadcrumbs && {
        ...nextState.breadcrumbs,
      };
      nextState.breadcrumbs = null;
    }),
  )
  .handleAction(actions.addProjectToBreadcrumbs, (state, { payload }) =>
    produce(state, (nextState) => {
      if (nextState.breadcrumbs?.type === InboxItemType.FeedItemFollow) {
        nextState.breadcrumbs.items =
          nextState.breadcrumbs.items.concat(payload);
      }
    }),
  );
