import React, { FC, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { QueryParamKey } from "@/shared/constants";
import { useQueryParams } from "@/shared/hooks";
import { useInboxItems } from "@/shared/hooks/useCases";
import { RightArrowThinIcon } from "@/shared/icons";
import { CommonSidenavLayoutTabs } from "@/shared/layouts";
import { Loader, NotFound, PureCommonTopNavigation } from "@/shared/ui-kit";
import { inboxActions, selectSharedInboxItem } from "@/store/states";
import { FeedLayout, FeedLayoutRef, HeaderContent } from "./components";
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
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const {
    data: inboxData,
    fetched: isInboxDataFetched,
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
  const isDataFetched = isInboxDataFetched;

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
      {/*<FeedLayout*/}
      {/*  ref={setFeedLayoutRef}*/}
      {/*  className={styles.feedLayout}*/}
      {/*  headerContent={*/}
      {/*    <HeaderContent*/}
      {/*      commonId={inboxData.common.id}*/}
      {/*      commonName={inboxData.common.name}*/}
      {/*      commonImage={inboxData.common.image}*/}
      {/*      commonMembersAmount={inboxData.commonMembersAmount}*/}
      {/*      commonMember={commonMember}*/}
      {/*      governance={inboxData.governance}*/}
      {/*      isProject={checkIsProject(inboxData.common)}*/}
      {/*    />*/}
      {/*  }*/}
      {/*  isGlobalLoading={!isGlobalDataFetched}*/}
      {/*  common={inboxData.common}*/}
      {/*  governance={inboxData.governance}*/}
      {/*  commonMember={commonMember}*/}
      {/*  topFeedItems={topFeedItems}*/}
      {/*  feedItems={inboxItems}*/}
      {/*  loading={areInboxItemsLoading || !hasAccessToPage}*/}
      {/*  shouldHideContent={!hasAccessToPage}*/}
      {/*  onFetchNext={fetchMoreInboxItems}*/}
      {/*/>*/}
      <CommonSidenavLayoutTabs className={styles.tabs} />
    </>
  );
};

export default InboxPage;
