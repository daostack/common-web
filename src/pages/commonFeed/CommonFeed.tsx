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
import { NavLink } from "react-router-dom";
import {
  CommonEvent,
  CommonEventEmitter,
  CommonEventToListener,
} from "@/events";
import { selectUser } from "@/pages/Auth/store/selectors";
import { MembershipRequestModal } from "@/pages/OldCommon/components";
import { FeedItemBaseContent, FeedItemBaseContentProps } from "@/pages/common";
import { JoinProjectModal } from "@/pages/common/components/JoinProjectModal";
import { useJoinProjectAutomatically } from "@/pages/common/hooks";
import {
  CommonAction,
  LOADER_APPEARANCE_DELAY,
  QueryParamKey,
} from "@/shared/constants";
import { useRoutesContext } from "@/shared/contexts";
import { useAuthorizedModal, useQueryParams } from "@/shared/hooks";
import {
  useCommonFeedItems,
  useLastVisitedCommon,
  useUserCommonIds,
} from "@/shared/hooks/useCases";
import { useCommonPinnedFeedItems } from "@/shared/hooks/useCases/useCommonPinnedFeedItems";
import { SidebarIcon } from "@/shared/icons";
import {
  checkIsFeedItemFollowLayoutItem,
  FeedLayoutItem,
  FeedLayoutItemChangeDataWithType,
  FeedLayoutRef,
} from "@/shared/interfaces";
import { CommonSidenavLayoutTabs } from "@/shared/layouts";
import { CirclesPermissions, CommonFeed, CommonMember } from "@/shared/models";
import { Loader, NotFound, PureCommonTopNavigation } from "@/shared/ui-kit";
import {
  checkIsAutomaticJoin,
  checkIsProject,
  getCommonPageAboutTabPath,
} from "@/shared/utils";
import {
  cacheActions,
  commonActions,
  selectCommonAction,
  selectIsSearchingFeedItems,
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
  renderLoadingHeader?: (() => ReactNode) | null;
  feedLayoutOuterStyles?: FeedLayoutOuterStyles;
  feedLayoutSettings?: FeedLayoutSettings;
  onActiveItemDataChange?: (data: FeedLayoutItemChangeDataWithType) => void;
}

const CommonFeedComponent: FC<CommonFeedProps> = (props) => {
  const {
    commonId,
    renderContentWrapper: outerContentWrapperRenderer,
    renderLoadingHeader,
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
  const isSearchingFeedItems = useSelector(selectIsSearchingFeedItems);
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
    stateRef,
    fetched: isCommonDataFetched,
    fetchCommonData,
  } = useCommonData(userId);
  const { updateLastVisitedCommon } = useLastVisitedCommon(userId);
  const parentCommonId = commonData?.common.directParent?.commonId;
  const anotherCommonId =
    userCommonIds[0] === commonId ? userCommonIds[1] : userCommonIds[0];
  const pinnedItemIds = useMemo(
    () => commonData?.common.pinnedFeedItems.map((item) => item.feedObjectId),
    [commonData?.common.pinnedFeedItems],
  );

  const {
    fetched: isGlobalDataFetched,
    fetchUserRelatedData,
    data: { commonMember, rootCommonMember, parentCommonMember },
  } = useGlobalCommonData({
    commonId,
    rootCommonId: commonData?.common.rootCommonId,
    parentCommonId,
    governanceCircles: commonData?.governance.circles,
    rootCommonGovernanceCircles: commonData?.rootCommonGovernance?.circles,
  });
  const {
    data: commonPinnedFeedItems,
    loading: areCommonPinnedFeedItemsLoading,
    fetch: fetchCommonPinnedFeedItems,
  } = useCommonPinnedFeedItems(commonId, pinnedItemIds);
  const isRootCommon = !parentCommonId;
  const isRootCommonMember = Boolean(rootCommonMember);
  const isRootCommonAutomaticAcceptance = checkIsAutomaticJoin(
    commonData?.rootCommonGovernance,
  );

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
    batchNumber,
  } = useCommonFeedItems(
    commonId,
    commonFeedItemIdsForNotListening,
    sharedFeedItemId,
  );

  const {
    isModalOpen: isCommonJoinModalOpen,
    onOpen: onCommonJoinModalOpen,
    onClose: onCommonJoinModalClose,
  } = useAuthorizedModal();
  const {
    isModalOpen: isRootCommonJoinModalOpen,
    onOpen: onRootCommonJoinModalOpen,
    onClose: onRootCommonJoinModalClose,
  } = useAuthorizedModal();
  const {
    isModalOpen: isProjectJoinModalOpen,
    onOpen: onProjectJoinModalOpen,
    onClose: onProjectJoinModalClose,
  } = useAuthorizedModal();
  const {
    canJoinProjectAutomatically,
    isJoinPending,
    onJoinProjectAutomatically,
  } = useJoinProjectAutomatically(
    commonMember,
    commonData?.common,
    commonData?.parentCommon,
  );

  const sharedFeedItem = useSelector(selectSharedFeedItem);
  const topFeedItems = useMemo(() => {
    const items: FeedLayoutItem[] = [];
    const filteredPinnedItems =
      commonPinnedFeedItems?.filter(
        (item) => item.itemId !== sharedFeedItemId,
      ) || [];

    if (filteredPinnedItems.length > 0) {
      items.push(...filteredPinnedItems);
    }
    if (sharedFeedItem) {
      items.push(sharedFeedItem);
    }

    return items;
  }, [sharedFeedItem, sharedFeedItemId, commonPinnedFeedItems]);
  const firstItem = commonFeedItems?.[0];
  const isDataFetched = isCommonDataFetched;
  const hasPublicItems = commonData?.common.hasPublicItems ?? false;

  const fetchData = () => {
    fetchCommonData({
      commonId,
      sharedFeedItemId,
    });
    fetchUserRelatedData();
  };

  const fetchMoreCommonFeedItems = (feedItemId?: string) => {
    if (hasMoreCommonFeedItems && !isSearchingFeedItems) {
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

  const renderChatInput = (): ReactNode => {
    if (commonMember) {
      return;
    }

    if (isJoinPending) {
      return (
        <div className={styles.chatInputLoaderWrapper}>
          <Loader />
        </div>
      );
    }

    if (commonData?.rootCommon && !isRootCommonMember) {
      return (
        <span
          className={styles.chatInputText}
          onClick={() => onRootCommonJoinModalOpen()}
        >
          Join {commonData.rootCommon.name}
        </span>
      );
    }

    if (isRootCommonMember && commonData?.parentCommon && !parentCommonMember) {
      return (
        <span className={styles.chatInputText}>
          To join this space you should first join{" "}
          <NavLink to={getCommonPagePath(commonData.parentCommon.id)}>
            {commonData.parentCommon.name}
          </NavLink>
        </span>
      );
    }

    const onJoinCommon = checkIsProject(commonData?.common)
      ? canJoinProjectAutomatically
        ? onJoinProjectAutomatically
        : onProjectJoinModalOpen
      : onCommonJoinModalOpen;

    return (
      <span className={styles.chatInputText} onClick={() => onJoinCommon()}>
        Join
      </span>
    );
  };

  useEffect(() => {
    if (
      !isCommonDataFetched ||
      !isGlobalDataFetched ||
      commonMember ||
      isRootCommon ||
      isRootCommonMember
    ) {
      return;
    }
    if (!isRootCommonAutomaticAcceptance || !hasPublicItems) {
      history.replace(getCommonPageAboutTabPath(commonId));
    }
  }, [
    isCommonDataFetched,
    isGlobalDataFetched,
    commonMember,
    isRootCommon,
    isRootCommonMember,
    commonId,
    isRootCommonAutomaticAcceptance,
    hasPublicItems,
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

    const interval = setInterval(() => {
      dispatch(cacheActions.copyFeedStateByCommonId(commonId));
    }, 5000);

    return () => {
      clearInterval(interval);
      dispatch(cacheActions.copyFeedStateByCommonId(commonId));
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

  useEffect(() => {
    if (commonMember && isCommonJoinModalOpen) {
      onCommonJoinModalClose();
    }
  }, [commonMember?.id]);

  useEffect(() => {
    if (rootCommonMember && isRootCommonJoinModalOpen) {
      onRootCommonJoinModalClose();
    }
  }, [rootCommonMember?.id]);

  useEffect(() => {
    const updateLastVisited = () => {
      const common = stateRef.current?.data?.common;

      updateLastVisitedCommon({
        id: commonId,
        data: common
          ? {
              name: common.name,
              image: common.image,
              isProject: checkIsProject(common),
              memberCount: common.memberCount,
            }
          : null,
      });
    };

    updateLastVisited();

    return () => {
      updateLastVisited();
    };
  }, [updateLastVisitedCommon, commonId]);

  if (!isDataFetched) {
    const headerEl = renderLoadingHeader ? (
      renderLoadingHeader()
    ) : (
      <PureCommonTopNavigation
        className={styles.pureCommonTopNavigation}
        iconEl={<SidebarIcon className={styles.openSidenavIcon} />}
      />
    );

    return (
      <>
        {headerEl}
        <div className={styles.centerWrapper}>
          <Loader delay={LOADER_APPEARANCE_DELAY} />
        </div>
        <CommonSidenavLayoutTabs className={styles.tabs} />
      </>
    );
  }

  if (!commonData) {
    return (
      <>
        <PureCommonTopNavigation
          className={styles.pureCommonTopNavigation}
          iconEl={<SidebarIcon className={styles.openSidenavIcon} />}
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
        governance={commonData.governance}
        commonMember={commonMember}
        topFeedItems={topFeedItems}
        feedItems={commonFeedItems}
        loading={areCommonFeedItemsLoading || isSearchingFeedItems}
        emptyText={
          hasMoreCommonFeedItems
            ? ""
            : "Looks like there are no matches for your query."
        }
        batchNumber={batchNumber}
        onFetchNext={fetchMoreCommonFeedItems}
        renderFeedItemBaseContent={renderFeedItemBaseContent}
        onFeedItemUpdate={handleFeedItemUpdate}
        getLastMessage={getLastMessage}
        sharedFeedItemId={sharedFeedItemId}
        onActiveItemDataChange={onActiveItemDataChange}
        outerStyles={feedLayoutOuterStyles}
        settings={feedLayoutSettings}
        renderChatInput={renderChatInput}
      />
      <CommonSidenavLayoutTabs className={styles.tabs} />
      {commonData.common && commonData.governance && (
        <>
          <MembershipRequestModal
            isShowing={isGlobalDataFetched && isCommonJoinModalOpen}
            onClose={onCommonJoinModalClose}
            common={commonData.common}
            governance={commonData.governance}
            showLoadingAfterSuccessfulCreation
          />
          <JoinProjectModal
            isShowing={isGlobalDataFetched && isProjectJoinModalOpen}
            onClose={onProjectJoinModalClose}
            common={commonData.common}
            governance={commonData.governance}
            onRequestCreated={() => null}
          />
        </>
      )}
      {commonData.rootCommon && commonData.rootCommonGovernance && (
        <MembershipRequestModal
          isShowing={isGlobalDataFetched && isRootCommonJoinModalOpen}
          onClose={onRootCommonJoinModalClose}
          common={commonData.rootCommon}
          governance={commonData.rootCommonGovernance}
          showLoadingAfterSuccessfulCreation
        />
      )}
    </>
  );
};

export default CommonFeedComponent;
