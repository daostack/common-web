import React, {
  CSSProperties,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
  CommonEvent,
  CommonEventEmitter,
  CommonEventToListener,
} from "@/events";
import { selectUser } from "@/pages/Auth/store/selectors";
import { FeedItemBaseContent, FeedItemBaseContentProps } from "@/pages/common";
import { CommonAction, QueryParamKey } from "@/shared/constants";
import { useRoutesContext } from "@/shared/contexts";
import { useQueryParams } from "@/shared/hooks";
import { useCommonFeedItems, useUserCommonIds } from "@/shared/hooks/useCases";
import { useCommonPinnedFeedItems } from "@/shared/hooks/useCases/useCommonPinnedFeedItems";
import { RightArrowThinIcon } from "@/shared/icons";
import {
  checkIsFeedItemFollowLayoutItem,
  FeedLayoutItem,
  FeedLayoutItemChangeDataWithType,
  FeedLayoutRef,
} from "@/shared/interfaces";
import { CommonSidenavLayoutTabs } from "@/shared/layouts";
import { CirclesPermissions, CommonFeed, CommonMember } from "@/shared/models";
import { Loader, NotFound, PureCommonTopNavigation } from "@/shared/ui-kit";
import { getCommonPageAboutTabPath } from "@/shared/utils";
import {
  commonActions,
  selectCommonAction,
  selectRecentStreamId,
  selectSharedFeedItem,
} from "@/store/states";
import {
  NewDiscussionCreation,
  NewProposalCreation,
} from "../common/components/CommonTabPanels/components/FeedTab/components";
import {
  FeedLayout,
  FeedLayoutOuterStyles,
  FeedLayoutSettings,
} from "./components";
import { CommonData, useCommonData, useGlobalCommonData } from "./hooks";
import { getLastMessage } from "./utils";
import styles from "./CommonFeed.module.scss";

export type RenderCommonFeedContentWrapper = (data: {
  children: ReactNode;
  wrapperStyles?: CSSProperties;
  commonData: CommonData;
  commonMember: (CommonMember & CirclesPermissions) | null;
  isGlobalDataFetched: boolean;
}) => ReactNode;

export interface CommonFeedProps {
  commonId: string;
  renderContentWrapper: RenderCommonFeedContentWrapper;
  feedLayoutOuterStyles?: FeedLayoutOuterStyles;
  feedLayoutSettings?: FeedLayoutSettings;
  onActiveItemDataChange?: (data: FeedLayoutItemChangeDataWithType) => void;
}

const CommonFeedComponent: FC<CommonFeedProps> = (props) => {
  const {
    commonId,
    renderContentWrapper: outerContentWrapperRenderer,
    feedLayoutOuterStyles,
    feedLayoutSettings,
    onActiveItemDataChange,
  } = props;
  const { getCommonPagePath, getProfilePagePath } = useRoutesContext();
  const queryParams = useQueryParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const recentStreamId = useSelector(selectRecentStreamId);
  const [feedLayoutRef, setFeedLayoutRef] = useState<FeedLayoutRef | null>(
    null,
  );
  const { data: userCommonIds } = useUserCommonIds();
  const sharedFeedItemIdQueryParam = queryParams[QueryParamKey.Item];
  const sharedFeedItemId =
    (typeof sharedFeedItemIdQueryParam === "string" &&
      sharedFeedItemIdQueryParam) ||
    null;
  const commonAction = useSelector(selectCommonAction);
  const {
    data: commonData,
    fetched: isCommonDataFetched,
    fetchCommonData,
  } = useCommonData(userId);
  const parentCommonId = commonData?.common.directParent?.commonId;
  const isRootCommon = !parentCommonId;
  const isRootCommonMember = Boolean(commonData?.rootCommonMember);
  const anotherCommonId =
    userCommonIds[0] === commonId ? userCommonIds[1] : userCommonIds[0];
  const pinnedItemIds = useMemo(
    () => commonData?.common.pinnedFeedItems.map((item) => item.feedObjectId),
    [commonData?.common.pinnedFeedItems],
  );

  const {
    fetched: isGlobalDataFetched,
    fetchUserRelatedData,
    data: { commonMember },
  } = useGlobalCommonData({
    commonId,
    governanceCircles: commonData?.governance.circles,
  });
  const {
    data: commonPinnedFeedItems,
    loading: areCommonPinnedFeedItemsLoading,
    fetch: fetchCommonPinnedFeedItems,
  } = useCommonPinnedFeedItems(commonId, pinnedItemIds);

  const commonFeedItemIdsForNotListening = useMemo(() => {
    const items: string[] = [];
    if (pinnedItemIds) {
      items.push(...pinnedItemIds);
    }
    if (commonPinnedFeedItems) {
      items.push(...commonPinnedFeedItems.map((item) => item.itemId));
    }
    if (sharedFeedItemId) {
      items.push(sharedFeedItemId);
    }
    return Array.from(new Set(items));
  }, [sharedFeedItemId, pinnedItemIds, commonPinnedFeedItems]);
  const {
    data: commonFeedItems,
    loading: areCommonFeedItemsLoading,
    hasMore: hasMoreCommonFeedItems,
    fetch: fetchCommonFeedItems,
  } = useCommonFeedItems(commonId, commonFeedItemIdsForNotListening);

  const sharedFeedItem = useSelector(selectSharedFeedItem);
  const topFeedItems = useMemo(() => {
    const items: FeedLayoutItem[] = [];
    const filteredPinnedItems =
      commonPinnedFeedItems?.filter(
        (item) => item.itemId !== sharedFeedItemId,
      ) || [];

    if (sharedFeedItem) {
      items.push(sharedFeedItem);
    }
    if (filteredPinnedItems.length > 0) {
      items.push(...filteredPinnedItems);
    }

    return items;
  }, [sharedFeedItem, sharedFeedItemId, commonPinnedFeedItems]);
  const firstItem = commonFeedItems?.[0];
  const isDataFetched = isCommonDataFetched;
  const hasPublicItem = true;

  const fetchData = () => {
    fetchCommonData({
      commonId,
      sharedFeedItemId,
    });
    fetchUserRelatedData();
  };

  const fetchMoreCommonFeedItems = (feedItemId?: string) => {
    if (hasMoreCommonFeedItems) {
      fetchCommonFeedItems(feedItemId);
    }
  };

  const renderFeedItemBaseContent = useCallback(
    (props: FeedItemBaseContentProps) => <FeedItemBaseContent {...props} />,
    [],
  );

  const handleFeedItemUpdate = useCallback(
    (item: CommonFeed, isRemoved: boolean) => {
      dispatch(
        commonActions.updateFeedItem({
          item,
          isRemoved,
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    if (!isCommonDataFetched || !isGlobalDataFetched || commonMember) {
      return;
    }
    if (!hasPublicItem && !isRootCommon && !isRootCommonMember) {
      history.replace(getCommonPageAboutTabPath(commonId));
    }
  }, [
    isCommonDataFetched,
    isGlobalDataFetched,
    commonMember,
    hasPublicItem,
    isRootCommon,
    isRootCommonMember,
    commonId,
  ]);

  useEffect(() => {
    dispatch(commonActions.setSharedFeedItemId(sharedFeedItemId));

    if (sharedFeedItemId) {
      feedLayoutRef?.setExpandedFeedItemId(sharedFeedItemId);
    }
  }, [sharedFeedItemId, feedLayoutRef]);

  useEffect(() => {
    if (commonData?.sharedFeedItem) {
      dispatch(commonActions.setSharedFeedItem(commonData.sharedFeedItem));
    }
  }, [commonData?.sharedFeedItem]);

  useEffect(() => {
    fetchData();

    return () => {
      dispatch(commonActions.resetCommon());
    };
  }, [commonId]);

  useEffect(() => {
    fetchUserRelatedData();
  }, [userId]);

  useEffect(() => {
    if (!commonFeedItems && !areCommonFeedItemsLoading) {
      fetchCommonFeedItems();
    }
  }, [commonFeedItems, areCommonFeedItemsLoading]);

  useEffect(() => {
    if (!commonPinnedFeedItems && !areCommonPinnedFeedItemsLoading) {
      fetchCommonPinnedFeedItems();
    }
  }, [commonPinnedFeedItems, areCommonPinnedFeedItemsLoading]);

  useEffect(() => {
    if (
      checkIsFeedItemFollowLayoutItem(firstItem) &&
      recentStreamId === firstItem.feedItem.data.id
    ) {
      feedLayoutRef?.setActiveItem({
        feedItemId: firstItem.feedItem.id,
        circleVisibility: [],
      });
      dispatch(commonActions.setRecentStreamId(""));
    }
  }, [feedLayoutRef, recentStreamId, firstItem]);

  useEffect(() => {
    const handler: CommonEventToListener[CommonEvent.CommonDeleted] = (
      deletedCommonId,
    ) => {
      if (deletedCommonId !== commonId) {
        return;
      }
      if (parentCommonId || anotherCommonId) {
        history.push(getCommonPagePath(parentCommonId || anotherCommonId));
      } else {
        history.push(getProfilePagePath());
      }
    };

    CommonEventEmitter.on(CommonEvent.CommonDeleted, handler);

    return () => {
      CommonEventEmitter.off(CommonEvent.CommonDeleted, handler);
    };
  }, [
    commonId,
    parentCommonId,
    anotherCommonId,
    getCommonPagePath,
    getProfilePagePath,
  ]);

  if (!isDataFetched) {
    return (
      <div className={styles.centerWrapper}>
        <Loader />
      </div>
    );
  }
  if (!commonData) {
    return (
      <>
        <PureCommonTopNavigation
          className={styles.pureCommonTopNavigation}
          iconEl={<RightArrowThinIcon className={styles.openSidenavIcon} />}
        />
        <div className={styles.centerWrapper}>
          <NotFound />
        </div>
        <CommonSidenavLayoutTabs className={styles.tabs} />
      </>
    );
  }

  const renderContentWrapper = (
    children: ReactNode,
    wrapperStyles?: CSSProperties,
  ): ReactNode =>
    outerContentWrapperRenderer({
      children,
      wrapperStyles,
      commonData,
      commonMember,
      isGlobalDataFetched,
    });

  return (
    <>
      <FeedLayout
        ref={setFeedLayoutRef}
        className={styles.feedLayout}
        renderContentWrapper={renderContentWrapper}
        topContent={
          <>
            {(commonAction === CommonAction.NewDiscussion ||
              commonAction === CommonAction.EditDiscussion) && (
              <NewDiscussionCreation
                common={commonData.common}
                governanceCircles={commonData.governance.circles}
                commonMember={commonMember}
                isModalVariant={false}
                edit={commonAction === CommonAction.EditDiscussion}
                defaultVisibility={
                  commonData.governance.discussions.defaultVisibility
                }
              />
            )}
            {commonAction === CommonAction.NewProposal && (
              <NewProposalCreation
                common={commonData.common}
                governance={commonData.governance}
                parentCommons={commonData.parentCommons}
                subCommons={commonData.subCommons}
                commonMember={commonMember}
                isModalVariant={false}
              />
            )}
          </>
        }
        common={commonData.common}
        parentCommon={commonData.parentCommon}
        governance={commonData.governance}
        commonMember={commonMember}
        topFeedItems={topFeedItems}
        feedItems={commonFeedItems}
        loading={areCommonFeedItemsLoading}
        onFetchNext={fetchMoreCommonFeedItems}
        renderFeedItemBaseContent={renderFeedItemBaseContent}
        onFeedItemUpdate={handleFeedItemUpdate}
        getLastMessage={getLastMessage}
        sharedFeedItemId={sharedFeedItemId}
        onActiveItemDataChange={onActiveItemDataChange}
        outerStyles={feedLayoutOuterStyles}
        settings={feedLayoutSettings}
      />
      <CommonSidenavLayoutTabs className={styles.tabs} />
    </>
  );
};

export default CommonFeedComponent;
