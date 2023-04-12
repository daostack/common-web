import React, { FC, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  selectUserNotificationsAmount,
} from "@/pages/Auth/store/selectors";
import { FeedLayout, FeedLayoutRef } from "@/pages/commonFeed";
import { QueryParamKey } from "@/shared/constants";
import { useQueryParams } from "@/shared/hooks";
import { useInboxItems } from "@/shared/hooks/useCases";
import { RightArrowThinIcon } from "@/shared/icons";
import { CommonSidenavLayoutTabs } from "@/shared/layouts";
import { Loader, NotFound, PureCommonTopNavigation } from "@/shared/ui-kit";
import { inboxActions, selectSharedInboxItem } from "@/store/states";
import { HeaderContent } from "./components";
import { useInboxData } from "./hooks";
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
  const userNotificationsAmount = useSelector(selectUserNotificationsAmount());
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
          <HeaderContent newMessagesAmount={userNotificationsAmount || 0} />
        }
        isGlobalLoading={false}
        common={{} as any}
        governance={{} as any}
        commonMember={null}
        topFeedItems={[]}
        feedItems={[]}
        loading={areInboxItemsLoading || !user}
        shouldHideContent={!user}
        onFetchNext={fetchMoreInboxItems}
      />
      <CommonSidenavLayoutTabs className={styles.tabs} />
    </>
  );
};

export default InboxPage;
