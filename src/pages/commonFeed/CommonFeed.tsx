import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useCommonFeedItems } from "@/shared/hooks/useCases";
import { Loader, NotFound } from "@/shared/ui-kit";
import { checkIsProject } from "@/shared/utils";
import { commonActions } from "@/store/states";
import { FeedLayout, HeaderContent } from "./components";
import { useCommonData, useGlobalCommonData } from "./hooks";
import styles from "./CommonFeed.module.scss";

interface CommonFeedPageRouterParams {
  id: string;
}

const CommonFeedPage: FC = () => {
  const { id: commonId } = useParams<CommonFeedPageRouterParams>();
  const dispatch = useDispatch();
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
  } = useCommonFeedItems(commonId);
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const isDataFetched = isCommonDataFetched;

  const fetchData = () => {
    fetchCommonData(commonId);
    fetchUserRelatedData();
  };

  const fetchMoreCommonFeedItems = () => {
    if (hasMoreCommonFeedItems) {
      fetchCommonFeedItems();
    }
  };

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
      <div className={styles.centerWrapper}>
        <NotFound />
      </div>
    );
  }

  return (
    <FeedLayout
      headerContent={
        <HeaderContent
          commonId={commonData.common.id}
          commonName={commonData.common.name}
          commonImage={commonData.common.image}
          commonMembersAmount={commonData.commonMembersAmount}
          isProject={checkIsProject(commonData.common)}
        />
      }
      isGlobalLoading={!isGlobalDataFetched}
      common={commonData.common}
      governance={commonData.governance}
      commonMember={commonMember}
      feedItems={commonFeedItems}
      loading={areCommonFeedItemsLoading}
      onFetchNext={fetchMoreCommonFeedItems}
    />
  );
};

export default CommonFeedPage;
