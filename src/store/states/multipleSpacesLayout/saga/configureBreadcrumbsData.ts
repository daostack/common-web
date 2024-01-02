import { put, select } from "redux-saga/effects";
import { InboxItemType } from "@/shared/constants";
import {
  MultipleSpacesLayoutFeedItemBreadcrumbs,
  selectCommonLayoutCommonsState,
  selectCommonLayoutProjectsState,
} from "@/store/states";
import * as actions from "../actions";
import { selectMultipleSpacesLayoutBreadcrumbs } from "../selectors";
import { MultipleSpacesLayoutState, ProjectsStateItem } from "../types";

const getItemsByExistingData = (
  activeCommonId: string,
  existingItems: ProjectsStateItem[],
): ProjectsStateItem[] | null => {
  const currentItem = existingItems.find(
    (item) => item.commonId === activeCommonId,
  );

  if (!currentItem) {
    return null;
  }

  const items: ProjectsStateItem[] = [currentItem];
  let parentCommonId = currentItem.directParent?.commonId;

  while (parentCommonId) {
    const parentItem = existingItems.find(
      (item) => item.commonId === parentCommonId,
    );

    if (!parentItem) {
      return null;
    }

    items.unshift(parentItem);
    parentCommonId = parentItem.directParent?.commonId;
  }

  return items;
};

const getNextBreadcrumbsData = (
  items: ProjectsStateItem[] | null,
  currentBreadcrumbs: MultipleSpacesLayoutFeedItemBreadcrumbs | null,
  activeCommonId: string,
): Pick<
  MultipleSpacesLayoutFeedItemBreadcrumbs,
  "items" | "areItemsLoading" | "areItemsFetched"
> => {
  if (items) {
    return {
      items,
      areItemsLoading: false,
      areItemsFetched: true,
    };
  }
  if (!currentBreadcrumbs) {
    return {
      items: [],
      areItemsLoading: true,
      areItemsFetched: false,
    };
  }

  const activeItemIndex = currentBreadcrumbs.items.findIndex(
    (item) => item.commonId === activeCommonId,
  );

  return {
    ...currentBreadcrumbs,
    items:
      activeItemIndex > -1
        ? currentBreadcrumbs.items.slice(0, activeItemIndex + 1)
        : currentBreadcrumbs.items,
  };
};

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

  const { commons, areCommonsFetched } = (yield select(
    selectCommonLayoutCommonsState,
  )) as { commons: ProjectsStateItem[]; areCommonsFetched: boolean };
  const { projects } = (yield select(selectCommonLayoutProjectsState)) as {
    projects: ProjectsStateItem[];
  };
  const items = areCommonsFetched
    ? getItemsByExistingData(payload.activeCommonId, [...commons, ...projects])
    : null;

  yield put(
    actions.setBreadcrumbsData({
      ...getNextBreadcrumbsData(
        items,
        currentBreadcrumbs,
        payload.activeCommonId,
      ),
      type: InboxItemType.FeedItemFollow,
      activeItem: payload.activeItem ? { ...payload.activeItem } : null,
      activeCommonId: payload.activeCommonId,
    }),
  );

  if (!items) {
    yield put(
      actions.fetchBreadcrumbsItemsByCommonId.request(payload.activeCommonId),
    );
  } else {
    yield put(
      actions.fetchBreadcrumbsItemsByCommonId.cancel(
        "Stop current breadcrumbs items fetch",
      ),
    );
  }
}
