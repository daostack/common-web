import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useCommonFeedItems } from "@/shared/hooks/useCases";
import { RightArrowThinIcon } from "@/shared/icons";
import { CommonSidenavLayoutTabs } from "@/shared/layouts";
import { Loader, NotFound, PureCommonTopNavigation } from "@/shared/ui-kit";
import { checkIsProject, getCommonPageAboutTabPath } from "@/shared/utils";
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
  const history = useHistory();
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
  const hasAccessToPage = Boolean(commonMember);

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
    if (!user || (isGlobalDataFetched && !commonMember)) {
      history.push(getCommonPageAboutTabPath(commonId));
    }
  }, [user, isGlobalDataFetched, commonMember, commonId]);

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
        className={styles.feedLayout}
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
        loading={areCommonFeedItemsLoading || !hasAccessToPage}
        shouldHideContent={!hasAccessToPage}
        onFetchNext={fetchMoreCommonFeedItems}
      />
      <CommonSidenavLayoutTabs className={styles.tabs} />
    </>
  );
};

export default CommonFeedPage;
