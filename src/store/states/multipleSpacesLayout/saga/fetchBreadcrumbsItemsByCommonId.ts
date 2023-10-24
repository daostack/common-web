import { call, put, select } from "redux-saga/effects";
import { CommonService } from "@/services";
import { InboxItemType } from "@/shared/constants";
import { Awaited } from "@/shared/interfaces";
import { Common } from "@/shared/models";
import * as actions from "../actions";
import { selectMultipleSpacesLayoutBreadcrumbs } from "../selectors";
import { MultipleSpacesLayoutState } from "../types";

const fetchProjectsInfoByActiveCommonId = async (
  commonId: string,
): Promise<Common[]> => {
  const activeCommon = await CommonService.getCommonById(commonId);

  if (!activeCommon) {
    return [];
  }

  const commons = await CommonService.getAllParentCommonsForCommon(
    activeCommon,
  );

  return [...commons, activeCommon];
};

export function* fetchBreadcrumbsItemsByCommonId(
  action: ReturnType<typeof actions.fetchBreadcrumbsItemsByCommonId.request>,
) {
  const { payload: commonId } = action;

  if (!commonId) {
    return;
  }

  const currentBreadcrumbs = (yield select(
    selectMultipleSpacesLayoutBreadcrumbs,
  )) as MultipleSpacesLayoutState["breadcrumbs"];

  if (currentBreadcrumbs?.type !== InboxItemType.FeedItemFollow) {
    return;
  }

  yield put(
    actions.setBreadcrumbsData({
      ...currentBreadcrumbs,
      areItemsLoading: true,
      areItemsFetched: false,
    }),
  );

  try {
    const commons = (yield call(
      fetchProjectsInfoByActiveCommonId,
      commonId,
    )) as Awaited<ReturnType<typeof fetchProjectsInfoByActiveCommonId>>;
    const currentBreadcrumbs = (yield select(
      selectMultipleSpacesLayoutBreadcrumbs,
    )) as MultipleSpacesLayoutState["breadcrumbs"];

    if (currentBreadcrumbs?.type === InboxItemType.FeedItemFollow) {
      yield put(
        actions.setBreadcrumbsData({
          ...currentBreadcrumbs,
          items: commons,
          areItemsLoading: false,
          areItemsFetched: true,
        }),
      );
    }
  } catch (error) {
    const currentBreadcrumbs = (yield select(
      selectMultipleSpacesLayoutBreadcrumbs,
    )) as MultipleSpacesLayoutState["breadcrumbs"];

    if (currentBreadcrumbs?.type === InboxItemType.FeedItemFollow) {
      yield put(
        actions.setBreadcrumbsData({
          ...currentBreadcrumbs,
          items: [],
          areItemsLoading: false,
          areItemsFetched: true,
        }),
      );
    }
  }
}
