import React, { FC, useEffect } from "react";
import { useCommonDataContext } from "@/pages/common/providers";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { useCommonFeedItems } from "../../hooks";
import { FeedItem } from "./component";
import styles from "./FeedItems.module.scss";

const FeedItems: FC = () => {
  const { common, governance } = useCommonDataContext();
  const {
    data: commonFeedItems,
    loading,
    hasMore,
    fetch: fetchCommonFeedItems,
  } = useCommonFeedItems(common.id);
  const isTabletView = useIsTabletView();

  const fetchMore = () => {
    if (hasMore) {
      fetchCommonFeedItems();
    }
  };

  useEffect(() => {
    if (!commonFeedItems && !loading) {
      fetchCommonFeedItems();
    }
  }, []);

  return (
    <div className={styles.container}>
      {commonFeedItems?.map((item) => (
        <FeedItem
          key={item.id}
          commonId={common.id}
          item={item}
          governanceCircles={governance.circles}
          isMobileVersion={isTabletView}
        />
      ))}
    </div>
  );
};

export default FeedItems;
