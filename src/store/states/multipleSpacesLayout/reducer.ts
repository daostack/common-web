import produce from "immer";
import { WritableDraft } from "immer/dist/types/types-external";
import { cloneDeep } from "lodash";
import { ActionType, createReducer } from "typesafe-actions";
import { InboxItemType } from "@/shared/constants";
import * as actions from "./actions";
import { MultipleSpacesLayoutState, ProjectsStateItem } from "./types";

type Action = ActionType<typeof actions>;

const initialState: MultipleSpacesLayoutState = {
  breadcrumbs: null,
  previousBreadcrumbs: null,
  backUrl: null,
  mainWidth: window.innerWidth,
};

const updateProjectInBreadcrumbs = (
  state: WritableDraft<MultipleSpacesLayoutState>,
  payload: { commonId: string } & Partial<Omit<ProjectsStateItem, "commonId">>,
): void => {
  if (state.breadcrumbs?.type !== InboxItemType.FeedItemFollow) {
    return;
  }

  const itemIndex = state.breadcrumbs.items.findIndex(
    (item) => item.commonId === payload.commonId,
  );

  if (itemIndex > -1) {
    state.breadcrumbs.items[itemIndex] = {
      ...state.breadcrumbs.items[itemIndex],
      ...payload,
    };
  }
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
  .handleAction(actions.addOrUpdateProjectInBreadcrumbs, (state, { payload }) =>
    produce(state, (nextState) => {
      if (nextState.breadcrumbs?.type !== InboxItemType.FeedItemFollow) {
        return;
      }

      const isItemFound = nextState.breadcrumbs.items.some(
        (item) => item.commonId === payload.commonId,
      );

      if (isItemFound) {
        updateProjectInBreadcrumbs(nextState, payload);
      } else {
        nextState.breadcrumbs.items =
          nextState.breadcrumbs.items.concat(payload);
      }
    }),
  )
  .handleAction(actions.updateProjectInBreadcrumbs, (state, { payload }) =>
    produce(state, (nextState) => {
      updateProjectInBreadcrumbs(nextState, payload);
    }),
  )
  .handleAction(actions.setBackUrl, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.backUrl = payload;
    }),
  )
  .handleAction(actions.setMainWidth, (state, { payload }) =>
    produce(state, (nextState) => {
      nextState.mainWidth = payload;
    }),
  );
