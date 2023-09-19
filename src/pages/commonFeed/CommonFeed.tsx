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
import { CommonAction, QueryParamKey } from "@/shared/constants";
import { useRoutesContext } from "@/shared/contexts";
import { useAuthorizedModal, useQueryParams } from "@/shared/hooks";
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
import {
  checkIsAutomaticJoin,
  checkIsProject,
  getCommonPageAboutTabPath,
} from "@/shared/utils";
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
  const isRootCommonAutomaticAcceptance = checkIsAutomaticJoin(
    commonData?.rootCommonGovernance,
  );
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
  const hasPublicItems = commonData?.common.hasPublicItems ?? false;

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

    if (
      isRootCommonMember &&
      commonData?.parentCommon &&
      !commonData?.parentCommonMember
    ) {
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
    if (commonMember && isRootCommonJoinModalOpen) {
      onRootCommonJoinModalClose();
    }
  }, [commonMember?.id]);

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
        renderChatInput={renderChatInput}
      />
      <CommonSidenavLayoutTabs className={styles.tabs} />
      {commonData.common && commonData.governance && (
        <>
          <MembershipRequestModal
            isShowing={isCommonJoinModalOpen}
            onClose={onCommonJoinModalClose}
            common={commonData.common}
            governance={commonData.governance}
            showLoadingAfterSuccessfulCreation
          />
          <JoinProjectModal
            isShowing={isProjectJoinModalOpen}
            onClose={onProjectJoinModalClose}
            common={commonData.common}
            governance={commonData.governance}
            onRequestCreated={() => null}
          />
        </>
      )}
      {commonData.rootCommon && commonData.rootCommonGovernance && (
        <MembershipRequestModal
          isShowing={isRootCommonJoinModalOpen}
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
