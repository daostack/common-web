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
import { selectUser } from "@/pages/Auth/store/selectors";
import { FeedItemBaseContentProps } from "@/pages/common";
import { FeedLayout } from "@/pages/commonFeed";
import { QueryParamKey } from "@/shared/constants";
import { ChatChannelToDiscussionConverter } from "@/shared/converters";
import { useQueryParams } from "@/shared/hooks";
import { useInboxItems } from "@/shared/hooks/useCases";
import { RightArrowThinIcon } from "@/shared/icons";
import {
  ChatChannelFeedLayoutItemProps,
  checkIsChatChannelLayoutItem,
  FeedLayoutItem,
  FeedLayoutItemChangeDataWithType,
  FeedLayoutRef,
} from "@/shared/interfaces";
import { CommonSidenavLayoutTabs } from "@/shared/layouts";
import { CommonFeed } from "@/shared/models";
import { Loader, NotFound, PureCommonTopNavigation } from "@/shared/ui-kit";
import {
  inboxActions,
  selectChatChannelItems,
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
  onActiveItemDataChange?: (data: FeedLayoutItemChangeDataWithType) => void;
}

const InboxPage: FC<InboxPageProps> = (props) => {
  const { renderContentWrapper, onActiveItemDataChange } = props;
  const queryParams = useQueryParams();
  const dispatch = useDispatch();
  const [feedLayoutRef, setFeedLayoutRef] = useState<FeedLayoutRef | null>(
    null,
  );
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
  } = useInboxItems(feedItemIdsForNotListening);
  const sharedInboxItem = useSelector(selectSharedInboxItem);
  const chatChannelItems = useSelector(selectChatChannelItems);
  const nextChatChannelItemId = useSelector(selectNextChatChannelItemId);
  const topFeedItems = useMemo(() => {
    const items: FeedLayoutItem[] = [];

    if (chatChannelItems.length > 0) {
      items.push(...chatChannelItems);
    }
    if (sharedInboxItem) {
      items.push(sharedInboxItem);
    }

    return items;
  }, [chatChannelItems, sharedInboxItem]);

  const fetchData = () => {
    fetchInboxData({
      sharedFeedItemId,
    });
  };

  const fetchMoreInboxItems = () => {
    if (hasMoreInboxItems) {
      fetchInboxItems();
    }
  };

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
      circleVisibility: [],
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
      dispatch(inboxActions.resetInbox());
    };
  }, [userId]);

  useEffect(() => {
    if (userId && !inboxItems && !areInboxItemsLoading) {
      fetchInboxItems();
    }
  }, [userId, inboxItems, areInboxItemsLoading]);

  if (!isDataFetched) {
    return (
      <div className={styles.centerWrapper}>
        <Loader />
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
        loading={areInboxItemsLoading || !user}
        shouldHideContent={!user}
        onFetchNext={fetchMoreInboxItems}
        renderFeedItemBaseContent={renderFeedItemBaseContent}
        renderChatChannelItem={renderChatChannelItem}
        onFeedItemUpdate={handleFeedItemUpdate}
        getLastMessage={getLastMessage}
        emptyText="Your inbox is empty"
        getNonAllowedItems={getNonAllowedItems}
        onActiveItemChange={handleActiveItemChange}
        onActiveItemDataChange={onActiveItemDataChange}
        onMessagesAmountEmptinessToggle={handleMessagesAmountEmptinessToggle}
      />
      <CommonSidenavLayoutTabs className={styles.tabs} />
    </>
  );
};

export default InboxPage;
