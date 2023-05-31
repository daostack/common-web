import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  selectUserStreamsWithNotificationsAmount,
} from "@/pages/Auth/store/selectors";
import { FeedItemBaseContentProps } from "@/pages/common";
import { FeedLayout } from "@/pages/commonFeed";
import { QueryParamKey } from "@/shared/constants";
import { useQueryParams } from "@/shared/hooks";
import { useInboxItems } from "@/shared/hooks/useCases";
import { RightArrowThinIcon } from "@/shared/icons";
import { FeedLayoutRef } from "@/shared/interfaces";
import { CommonSidenavLayoutTabs } from "@/shared/layouts";
import { CommonFeed } from "@/shared/models";
import { Loader, NotFound, PureCommonTopNavigation } from "@/shared/ui-kit";
import { inboxActions, selectSharedInboxItem } from "@/store/states";
import { HeaderContent, FeedItemBaseContent } from "./components";
import { useInboxData } from "./hooks";
import { getLastMessage } from "../commonFeed/utils";
import { getNonAllowedItems } from "./utils";
import styles from "./Inbox.module.scss";

const InboxPage: FC = () => {
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
  const userStreamsWithNotificationsAmount = useSelector(
    selectUserStreamsWithNotificationsAmount(),
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
  const topFeedItems = useMemo(
    () => (sharedInboxItem ? [sharedInboxItem] : []),
    [sharedInboxItem],
  );

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

  useEffect(() => {
    dispatch(inboxActions.setSharedFeedItemId(sharedFeedItemId));

    if (sharedFeedItemId) {
      feedLayoutRef?.setExpandedFeedItemId(sharedFeedItemId);
    }
  }, [sharedFeedItemId, feedLayoutRef]);

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
        headerContent={
          <HeaderContent
            streamsWithNotificationsAmount={
              userStreamsWithNotificationsAmount || 0
            }
          />
        }
        isGlobalLoading={false}
        commonMember={null}
        topFeedItems={topFeedItems}
        feedItems={inboxItems}
        loading={areInboxItemsLoading || !user}
        shouldHideContent={!user}
        onFetchNext={fetchMoreInboxItems}
        renderFeedItemBaseContent={renderFeedItemBaseContent}
        onFeedItemUpdate={handleFeedItemUpdate}
        getLastMessage={getLastMessage}
        emptyText="Your inbox is empty"
        getNonAllowedItems={getNonAllowedItems}
      />
      <CommonSidenavLayoutTabs className={styles.tabs} />
    </>
  );
};

export default InboxPage;
