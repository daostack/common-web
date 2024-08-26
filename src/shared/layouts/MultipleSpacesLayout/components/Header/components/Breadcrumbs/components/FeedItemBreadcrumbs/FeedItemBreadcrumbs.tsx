import React, { FC, useEffect, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { CommonEvent, CommonEventEmitter } from "@/events";
import { CommonService } from "@/services";
import { useIsTabletView } from "@/shared/hooks/viewport";
import {
  commonLayoutActions,
  MultipleSpacesLayoutFeedItemBreadcrumbs,
  ProjectsStateItem,
} from "@/store/states";
import { useGoToCreateCommon } from "../../../../../../hooks";
import { Separator } from "../Separator";
import { ActiveFeedBreadcrumbsItem, FeedBreadcrumbsItem } from "./components";
import styles from "./FeedItemBreadcrumbs.module.scss";

interface FeedItemBreadcrumbsProps {
  breadcrumbs: MultipleSpacesLayoutFeedItemBreadcrumbs;
  itemsWithMenus: boolean;
  truncate: boolean;
}

const FeedItemBreadcrumbs: FC<FeedItemBreadcrumbsProps> = ({
  breadcrumbs,
  itemsWithMenus,
  truncate,
}) => {
  const dispatch = useDispatch();
  const goToCreateCommon = useGoToCreateCommon();
  const isMobileView = useIsTabletView();

  const breadcrumbsItems = useMemo(() => {
    return truncate
      ? [breadcrumbs.items[0], breadcrumbs.items[breadcrumbs.items.length - 1]]
      : breadcrumbs.items;
  }, [breadcrumbs.items, truncate]);

  const handleItemClick = useCallback(
    (item: ProjectsStateItem) => {
      if (item.rootCommonId) {
        dispatch(
          commonLayoutActions.resetCurrentCommonIdAndProjects(
            item.rootCommonId,
          ),
        );
      }
    },
    [dispatch],
  );

  useEffect(() => {
    const commonIds = breadcrumbs.items.map((item) => item.commonId);

    if (commonIds.length === 0) {
      return;
    }

    const unsubscribe = CommonService.subscribeToCommons(commonIds, (data) => {
      data.forEach(({ common }) => {
        CommonEventEmitter.emit(CommonEvent.ProjectUpdated, {
          commonId: common.id,
          image: common.image,
          name: common.name,
          directParent: common.directParent,
          rootCommonId: common.rootCommonId,
        });
      });
    });

    return () => {
      unsubscribe();
    };
  }, [breadcrumbs.activeItem?.id]);

  return (
    <ul className={styles.container}>
      {!breadcrumbs.areItemsLoading &&
        breadcrumbsItems.map((item, index) => (
          <React.Fragment key={item.commonId}>
            {index > 0 && <Separator />}
            {truncate && index === 1 && (
              <>
                ...
                <Separator />
              </>
            )}
            <FeedBreadcrumbsItem
              activeItem={item}
              onCommonCreate={index === 0 ? goToCreateCommon : undefined}
              withMenu={itemsWithMenus}
              truncate={isMobileView}
              onClick={() => handleItemClick(item)}
            />
          </React.Fragment>
        ))}
      {breadcrumbs.activeItem && (
        <>
          {!breadcrumbs.areItemsLoading && breadcrumbs.items.length > 0 && (
            <Separator />
          )}
          {!isMobileView && (
            <ActiveFeedBreadcrumbsItem
              activeItemId={breadcrumbs.activeCommonId}
              name={breadcrumbs.activeItem.name}
              image={breadcrumbs.activeItem.image}
              withMenu={itemsWithMenus}
              truncate={isMobileView}
            />
          )}
        </>
      )}
    </ul>
  );
};

export default FeedItemBreadcrumbs;
