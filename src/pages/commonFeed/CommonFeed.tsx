import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { selectUser } from "@/pages/Auth/store/selectors";
import { FeedItemBaseContent, FeedItemBaseContentProps } from "@/pages/common";
import { CommonAction, QueryParamKey } from "@/shared/constants";
import { useQueryParams } from "@/shared/hooks";
import { useCommonFeedItems } from "@/shared/hooks/useCases";
import { RightArrowThinIcon } from "@/shared/icons";
import { CommonSidenavLayoutTabs } from "@/shared/layouts";
import { CommonFeed } from "@/shared/models";
import { Loader, NotFound, PureCommonTopNavigation } from "@/shared/ui-kit";
import { checkIsProject, getCommonPageAboutTabPath } from "@/shared/utils";
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
import { FeedLayout, FeedLayoutRef, HeaderContent } from "./components";
import { useCommonData, useGlobalCommonData } from "./hooks";
import styles from "./CommonFeed.module.scss";

interface CommonFeedProps {
  commonId: string;
}

const CommonFeedComponent: FC<CommonFeedProps> = (props) => {
  const { commonId } = props;
  const queryParams = useQueryParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const recentStreamId = useSelector(selectRecentStreamId);
  const [feedLayoutRef, setFeedLayoutRef] = useState<FeedLayoutRef | null>(
    null,
  );
  const sharedFeedItemIdQueryParam = queryParams[QueryParamKey.Item];
  const sharedFeedItemId =
    (typeof sharedFeedItemIdQueryParam === "string" &&
      sharedFeedItemIdQueryParam) ||
    null;
  const commonFeedItemIdsForNotListening = useMemo(
    () => (sharedFeedItemId ? [sharedFeedItemId] : []),
    [sharedFeedItemId],
  );
  const commonAction = useSelector(selectCommonAction);
  const {
    data: commonData,
    fetched: isCommonDataFetched,
    fetchCommonData,
  } = useCommonData();
  const {
    fetched: isGlobalDataFetched,
    fetchUserRelatedData,
    data: { commonMember },
  } = useGlobalCommonData({
    commonId,
    governanceCircles: commonData?.governance.circles,
  });
  const {
    data: commonFeedItems,
    loading: areCommonFeedItemsLoading,
    hasMore: hasMoreCommonFeedItems,
    fetch: fetchCommonFeedItems,
  } = useCommonFeedItems(commonId, commonFeedItemIdsForNotListening);
  const sharedFeedItem = useSelector(selectSharedFeedItem);
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const topFeedItems = useMemo(
    () => (sharedFeedItem ? [sharedFeedItem] : []),
    [sharedFeedItem],
  );
  const firstItem = commonFeedItems?.[0];
  const isDataFetched = isCommonDataFetched;
  const hasAccessToPage = Boolean(commonMember);

  const fetchData = () => {
    fetchCommonData({
      commonId,
      sharedFeedItemId,
    });
    fetchUserRelatedData();
  };

  const fetchMoreCommonFeedItems = () => {
    if (hasMoreCommonFeedItems) {
      fetchCommonFeedItems();
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
    if (!user || (isGlobalDataFetched && !commonMember)) {
      history.push(getCommonPageAboutTabPath(commonId));
    }
  }, [user, isGlobalDataFetched, commonMember, commonId]);

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
    if (recentStreamId === firstItem?.feedItem.data.id) {
      feedLayoutRef?.setExpandedFeedItemId(firstItem.feedItem.id);
      dispatch(commonActions.setRecentStreamId(""));
    }
  }, [feedLayoutRef, recentStreamId, firstItem]);

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

  return (
    <>
      <FeedLayout
        ref={setFeedLayoutRef}
        className={styles.feedLayout}
        headerContent={
          <HeaderContent
            commonId={commonData.common.id}
            commonName={commonData.common.name}
            commonImage={commonData.common.image}
            commonMembersAmount={commonData.commonMembersAmount}
            commonMember={commonMember}
            governance={commonData.governance}
            isProject={checkIsProject(commonData.common)}
          />
        }
        topContent={
          <>
            {commonAction === CommonAction.NewDiscussion && (
              <NewDiscussionCreation
                common={commonData.common}
                governanceCircles={commonData.governance.circles}
                commonMember={commonMember}
                isModalVariant={false}
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
        isGlobalLoading={!isGlobalDataFetched}
        common={commonData.common}
        governance={commonData.governance}
        commonMember={commonMember}
        topFeedItems={topFeedItems}
        feedItems={commonFeedItems}
        loading={areCommonFeedItemsLoading || !hasAccessToPage}
        shouldHideContent={!hasAccessToPage}
        onFetchNext={fetchMoreCommonFeedItems}
        renderFeedItemBaseContent={renderFeedItemBaseContent}
        onFeedItemUpdate={handleFeedItemUpdate}
      />
      <CommonSidenavLayoutTabs className={styles.tabs} />
    </>
  );
};

export default CommonFeedComponent;
