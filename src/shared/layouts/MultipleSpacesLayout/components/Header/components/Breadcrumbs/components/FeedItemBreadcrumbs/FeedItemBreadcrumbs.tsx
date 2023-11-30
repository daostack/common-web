import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonEvent, CommonEventEmitter } from "@/events";
import { CommonService } from "@/services";
import {
  commonLayoutActions,
  MultipleSpacesLayoutFeedItemBreadcrumbs,
  ProjectsStateItem,
  selectCommonLayoutCommonId,
} from "@/store/states";
import { useGoToCreateCommon } from "../../../../../../hooks";
import { LoadingBreadcrumbsItem } from "../LoadingBreadcrumbsItem";
import { Separator } from "../Separator";
import { ActiveFeedBreadcrumbsItem, FeedBreadcrumbsItem } from "./components";
import styles from "./FeedItemBreadcrumbs.module.scss";

interface FeedItemBreadcrumbsProps {
  breadcrumbs: MultipleSpacesLayoutFeedItemBreadcrumbs;
  itemsWithMenus: boolean;
}

const FeedItemBreadcrumbs: FC<FeedItemBreadcrumbsProps> = (props) => {
  const { breadcrumbs, itemsWithMenus } = props;
  const dispatch = useDispatch();
  const currentLayoutCommonId = useSelector(selectCommonLayoutCommonId);
  const goToCreateCommon = useGoToCreateCommon();

  const handleItemClick = (item: ProjectsStateItem) => {
    if (
      currentLayoutCommonId &&
      item.rootCommonId &&
      item.rootCommonId !== currentLayoutCommonId
    ) {
      dispatch(commonLayoutActions.setCurrentCommonId(item.rootCommonId));
      dispatch(commonLayoutActions.clearProjects());
    }
  };

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

    return unsubscribe;
  }, [breadcrumbs.activeItem?.id]);

  return (
    <ul className={styles.container}>
      {breadcrumbs.areItemsLoading && <LoadingBreadcrumbsItem />}
      {!breadcrumbs.areItemsLoading &&
        breadcrumbs.items.map((item, index) => (
          <React.Fragment key={item.commonId}>
            {index > 0 && <Separator />}
            <FeedBreadcrumbsItem
              activeItem={item}
              onCommonCreate={index === 0 ? goToCreateCommon : undefined}
              withMenu={itemsWithMenus}
              onClick={() => handleItemClick(item)}
            />
          </React.Fragment>
        ))}
      {breadcrumbs.activeItem && (
        <>
          {(breadcrumbs.areItemsLoading || breadcrumbs.items.length > 0) && (
            <Separator />
          )}
          <ActiveFeedBreadcrumbsItem
            activeItemId={breadcrumbs.activeCommonId}
            name={breadcrumbs.activeItem.name}
            image={breadcrumbs.activeItem.image}
            withMenu={itemsWithMenus}
          />
        </>
      )}
    </ul>
  );
};

export default FeedItemBreadcrumbs;
