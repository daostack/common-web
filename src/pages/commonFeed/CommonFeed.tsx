import React, { FC, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import { selectUser } from "@/pages/Auth/store/selectors";
import { CommonAction, QueryParamKey } from "@/shared/constants";
import { useQueryParams } from "@/shared/hooks";
import { useCommonFeedItems } from "@/shared/hooks/useCases";
import { RightArrowThinIcon } from "@/shared/icons";
import { CommonSidenavLayoutTabs } from "@/shared/layouts";
import { Loader, NotFound, PureCommonTopNavigation } from "@/shared/ui-kit";
import { checkIsProject, getCommonPageAboutTabPath } from "@/shared/utils";
import {
  commonActions,
  selectCommonAction,
  selectSharedFeedItem,
} from "@/store/states";
import {
  NewDiscussionCreation,
  NewProposalCreation,
} from "../common/components/CommonTabPanels/components/FeedTab/components";
import { FeedLayout, FeedLayoutRef, HeaderContent } from "./components";
import { useCommonData, useGlobalCommonData } from "./hooks";
import styles from "./CommonFeed.module.scss";

interface CommonFeedPageRouterParams {
  id: string;
}

const CommonFeedPage: FC = () => {
  const { id: commonId } = useParams<CommonFeedPageRouterParams>();
  const queryParams = useQueryParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const feedLayoutRef = useRef<FeedLayoutRef>(null);
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

  useEffect(() => {
    if (!user || (isGlobalDataFetched && !commonMember)) {
      history.push(getCommonPageAboutTabPath(commonId));
    }
  }, [user, isGlobalDataFetched, commonMember, commonId]);

  useEffect(() => {
    dispatch(commonActions.setSharedFeedItemId(sharedFeedItemId));

    if (sharedFeedItemId) {
      feedLayoutRef.current?.setExpandedFeedItemId(sharedFeedItemId);
    }
  }, [sharedFeedItemId]);

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
        ref={feedLayoutRef}
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
      />
      <CommonSidenavLayoutTabs className={styles.tabs} />
    </>
  );
};

export default CommonFeedPage;
