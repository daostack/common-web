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
import { useHistory } from "react-router-dom";
import { useUpdateEffect } from "react-use";
import { selectUser } from "@/pages/Auth/store/selectors";
import { FeedItemBaseContentProps } from "@/pages/common";
import {
  FeedLayout,
  FeedLayoutOuterStyles,
  FeedLayoutSettings,
} from "@/pages/commonFeed";
import { LOADER_APPEARANCE_DELAY, QueryParamKey } from "@/shared/constants";
import { useRoutesContext } from "@/shared/contexts";
import { ChatChannelToDiscussionConverter } from "@/shared/converters";
import { useQueryParams } from "@/shared/hooks";
import { useInboxItems } from "@/shared/hooks/useCases";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { RightArrowThinIcon } from "@/shared/icons";
import {
  ChatChannelFeedLayoutItemProps,
  checkIsChatChannelLayoutItem,
  FeedItemFollowLayoutItemWithFollowData,
  FeedLayoutItem,
  FeedLayoutItemChangeDataWithType,
  FeedLayoutRef,
} from "@/shared/interfaces";
import { CommonSidenavLayoutTabs } from "@/shared/layouts";
import { ChatChannel, CommonFeed } from "@/shared/models";
import { Loader, NotFound, PureCommonTopNavigation } from "@/shared/ui-kit";
import {
  inboxActions,
  selectChatChannelItems,
  selectOptimisticInboxFeedItems,
  selectInboxSearchValue,
  selectIsSearchingInboxItems,
  selectNextChatChannelItemId,
  selectSharedInboxItem,
} from "@/store/states";
import { ChatChannelItem, FeedItemBaseContent } from "./components";
import { useInboxData } from "./hooks";
import { getLastMessage, getNonAllowedItems } from "./utils";
import styles from "./BaseInbox.module.scss";

interface InboxPageProps {
  renderContentWrapper: (
    children: ReactNode,
    wrapperStyles?: CSSProperties,
  ) => ReactNode;
  feedLayoutOuterStyles?: FeedLayoutOuterStyles;
  feedLayoutSettings?: FeedLayoutSettings;
  onActiveItemDataChange?: (data: FeedLayoutItemChangeDataWithType) => void;
}

const InboxPage: FC<InboxPageProps> = (props) => {
  const {
    renderContentWrapper,
    feedLayoutOuterStyles,
    feedLayoutSettings,
    onActiveItemDataChange,
  } = props;
  const queryParams = useQueryParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const { getCommonPagePath } = useRoutesContext();
  const isTabletView = useIsTabletView();
  const [feedLayoutRef, setFeedLayoutRef] = useState<FeedLayoutRef | null>(
    null,
  );
  const isActiveUnreadInboxItemsQueryParam =
    queryParams[QueryParamKey.Unread] === "true";
  const sharedFeedItemIdQueryParam = queryParams[QueryParamKey.Item];
  const sharedFeedItemId =
    (typeof sharedFeedItemIdQueryParam === "string" &&
      sharedFeedItemIdQueryParam) ||
    null;
  const feedItemIdsForNotListening = useMemo(
    () => (sharedFeedItemId ? [sharedFeedItemId] : []),
    [sharedFeedItemId],
  );
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const isSearchingInboxItems = useSelector(selectIsSearchingInboxItems);
  const searchValue = useSelector(selectInboxSearchValue);
  const {
    data: inboxData,
    fetched: isDataFetched,
    fetchInboxData,
  } = useInboxData(userId);
  const {
    data: inboxItems,
    loading: areInboxItemsLoading,
    hasMore: hasMoreInboxItems,
    fetch: fetchInboxItems,
    refetch: refetchInboxItems,
    batchNumber,
  } = useInboxItems(feedItemIdsForNotListening, {
    unread: isActiveUnreadInboxItemsQueryParam,
  });

  const sharedInboxItem = useSelector(selectSharedInboxItem);
  const chatChannelItems = useSelector(selectChatChannelItems);
  const nextChatChannelItemId = useSelector(selectNextChatChannelItemId);
  const optimisticInboxFeedItems = useSelector(selectOptimisticInboxFeedItems);


  const getEmptyText = (): string => {
    if (hasMoreInboxItems) {
      return "";
    }

    if (searchValue) {
      return "Looks like there are no matches for your query.";
    }

    return isActiveUnreadInboxItemsQueryParam
      ? "Well done! No unread streams in your inbox :)"
      : "Your inbox is empty";
  };

  const topFeedItems = useMemo(() => {
    const items: FeedLayoutItem[] = [];

    if (optimisticInboxFeedItems.size > 0) {
      const optimisticItems = Array.from(optimisticInboxFeedItems.values());
      items.push(...optimisticItems);
    }

    if (chatChannelItems.length > 0) {
      items.push(...chatChannelItems);
    }
    if (sharedInboxItem) {
      items.push(sharedInboxItem);
    }

    return items;
  }, [chatChannelItems, sharedInboxItem, optimisticInboxFeedItems]);

  useUpdateEffect(() => {
    refetchInboxItems();
  }, [isActiveUnreadInboxItemsQueryParam]);

  useEffect(() => {
    const firstFeedItem = topFeedItems[0];
    if(optimisticInboxFeedItems.size > 0 && firstFeedItem) {

      feedLayoutRef?.setActiveItem({
        feedItemId: firstFeedItem.itemId,
        discussion: (firstFeedItem as FeedItemFollowLayoutItemWithFollowData)?.feedItem.optimisticData,
      });
    }

  }, [topFeedItems, optimisticInboxFeedItems, feedLayoutRef])

  const fetchData = () => {
    fetchInboxData({
      sharedFeedItemId,
    });
  };

  const fetchMoreInboxItems = useCallback(() => {
    if (hasMoreInboxItems && !isSearchingInboxItems && !areInboxItemsLoading) {
      fetchInboxItems();
    }
  },[hasMoreInboxItems, isSearchingInboxItems, areInboxItemsLoading]);

  const renderFeedItemBaseContent = useCallback(
    (props: FeedItemBaseContentProps) => <FeedItemBaseContent {...props} />,
    [],
  );

  const renderChatChannelItem = useCallback(
    (props: ChatChannelFeedLayoutItemProps) => <ChatChannelItem {...props} />,
    [],
  );

  const handleFeedItemUpdate = useCallback(
    (item: CommonFeed, isRemoved: boolean) => {
      dispatch(
        inboxActions.updateFeedItem({
          item,
          isRemoved,
        }),
      );

      if (!isRemoved && item.data.lastMessage?.ownerId === userId) {
        document
          .getElementById("feedLayoutWrapper")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [dispatch],
  );

  const handleFeedItemUnfollowed = useCallback(
    (itemId: string) => {
      dispatch(
        inboxActions.updateFeedItem({
          item: { id: itemId },
          isRemoved: true,
        }),
      );
    },
    [dispatch],
  );

  const handleActiveItemChange = useCallback(
    (activeItemId?: string) => {
      dispatch(inboxActions.removeEmptyChatChannelItems(activeItemId));
    },
    [dispatch],
  );

  const handleMessagesAmountEmptinessToggle = useCallback(
    (feedItem: FeedLayoutItem, becameEmpty: boolean) => {
      if (checkIsChatChannelLayoutItem(feedItem)) {
        dispatch(
          inboxActions.updateChatChannelItemEmptiness({
            id: feedItem.itemId,
            becameEmpty,
          }),
        );
      }
    },
    [dispatch],
  );

  const handleFeedItemSelect = useCallback(
    (commonId: string, feedItemId: string, messageId?: string) => {
      history.push(
        getCommonPagePath(commonId, {
          item: feedItemId,
          message: messageId,
        }),
      );
    },
    [history.push, getCommonPagePath],
  );

  const handleChatChannelCreate = useCallback(
    (chatChannel: ChatChannel) => {
      if (!isTabletView) {
        dispatch(inboxActions.addChatChannelItem(chatChannel));
      }
    },
    [dispatch, isTabletView],
  );

  useEffect(() => {
    dispatch(inboxActions.setSharedFeedItemId(sharedFeedItemId));

    if (sharedFeedItemId) {
      feedLayoutRef?.setExpandedFeedItemId(sharedFeedItemId);
    }
  }, [sharedFeedItemId, feedLayoutRef]);

  useEffect(() => {
    if (!nextChatChannelItemId) {
      return;
    }

    const chatChannelItem = chatChannelItems.find(
      (item) => item.itemId === nextChatChannelItemId,
    );

    if (!chatChannelItem) {
      return;
    }

    feedLayoutRef?.setActiveItem({
      feedItemId: chatChannelItem.itemId,
      chatChannel: chatChannelItem.chatChannel,
      discussion: ChatChannelToDiscussionConverter.toTargetEntity(
        chatChannelItem.chatChannel,
      ),
    });
  }, [nextChatChannelItemId, feedLayoutRef]);

  useEffect(() => {
    if (inboxData?.sharedInboxItem) {
      dispatch(inboxActions.setSharedInboxItem(inboxData.sharedInboxItem));
    }
  }, [inboxData?.sharedInboxItem]);

  useEffect(() => {
    fetchData();

    return () => {
      dispatch(inboxActions.resetInbox({ onlyIfUnread: true }));
    };
  }, [userId]);

  useEffect(() => {
    if (
      userId &&
      !inboxItems &&
      !areInboxItemsLoading &&
      !isSearchingInboxItems
    ) {
      fetchInboxItems();
    }
  }, [userId, inboxItems, areInboxItemsLoading, isSearchingInboxItems]);

  if (!isDataFetched) {
    return (
      <div className={styles.centerWrapper}>
        <Loader delay={LOADER_APPEARANCE_DELAY} />
      </div>
    );
  }
  if (!inboxData) {
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

  return (
    <>
      <FeedLayout
        ref={setFeedLayoutRef}
        className={styles.feedLayout}
        renderContentWrapper={renderContentWrapper}
        commonMember={null}
        topFeedItems={topFeedItems}
        feedItems={inboxItems}
        loading={areInboxItemsLoading || isSearchingInboxItems || !user}
        shouldHideContent={!user}
        batchNumber={batchNumber}
        isPreloadDisabled={Boolean(searchValue)}
        onFetchNext={fetchMoreInboxItems}
        renderFeedItemBaseContent={renderFeedItemBaseContent}
        renderChatChannelItem={renderChatChannelItem}
        onFeedItemUpdate={handleFeedItemUpdate}
        onFeedItemUnfollowed={handleFeedItemUnfollowed}
        getLastMessage={getLastMessage}
        sharedFeedItemId={sharedFeedItemId}
        emptyText={getEmptyText()}
        getNonAllowedItems={getNonAllowedItems}
        onActiveItemChange={handleActiveItemChange}
        onActiveItemDataChange={onActiveItemDataChange}
        onMessagesAmountEmptinessToggle={handleMessagesAmountEmptinessToggle}
        onFeedItemSelect={handleFeedItemSelect}
        onChatChannelCreate={handleChatChannelCreate}
        outerStyles={feedLayoutOuterStyles}
        settings={feedLayoutSettings}
        onPullToRefresh={refetchInboxItems}
      />
      <CommonSidenavLayoutTabs className={styles.tabs} />
    </>
  );
};

export default InboxPage;
