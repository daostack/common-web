import { put, select } from "redux-saga/effects";
import { InboxItemType } from "@/shared/constants";
import * as actions from "../actions";
import { selectMultipleSpacesLayoutBreadcrumbs } from "../selectors";
import { MultipleSpacesLayoutState } from "../types";

export function* configureBreadcrumbsData(
  action: ReturnType<typeof actions.configureBreadcrumbsData>,
) {
  const { payload } = action;

  if (payload.type === InboxItemType.ChatChannel) {
    yield put(
      actions.setBreadcrumbsData({
        type: InboxItemType.ChatChannel,
        activeItem: { ...payload.activeItem },
      }),
    );
    yield put(actions.fetchBreadcrumbsItemsByCommonId.request(null));
    return;
  }

  const currentBreadcrumbs = (yield select(
    selectMultipleSpacesLayoutBreadcrumbs,
  )) as MultipleSpacesLayoutState["breadcrumbs"];

  if (currentBreadcrumbs?.type === InboxItemType.ChatChannel) {
    yield put(
      actions.setBreadcrumbsData({
        type: InboxItemType.FeedItemFollow,
        activeItem: payload.activeItem ? { ...payload.activeItem } : null,
        activeCommonId: payload.activeCommonId,
        items: [],
        areItemsLoading: true,
        areItemsFetched: false,
      }),
    );
    yield put(
      actions.fetchBreadcrumbsItemsByCommonId.request(payload.activeCommonId),
    );
    return;
  }

  yield put(
    actions.setBreadcrumbsData({
      ...(currentBreadcrumbs || {
        items: [],
        areItemsLoading: true,
        areItemsFetched: false,
      }),
      type: InboxItemType.FeedItemFollow,
      activeItem: payload.activeItem ? { ...payload.activeItem } : null,
      activeCommonId: payload.activeCommonId,
    }),
  );

  if (
    currentBreadcrumbs?.activeCommonId !== payload.activeCommonId ||
    !currentBreadcrumbs.items.some((item) => item.id === payload.activeCommonId)
  ) {
    yield put(
      actions.fetchBreadcrumbsItemsByCommonId.request(payload.activeCommonId),
    );
  }
}
