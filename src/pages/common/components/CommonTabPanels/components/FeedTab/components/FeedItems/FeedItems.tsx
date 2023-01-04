import React, { FC, useEffect } from "react";
import { useCommonDataContext } from "@/pages/common/providers";
import { useCommonFeedItems } from "../../hooks";

const FeedItems: FC = () => {
  const { common } = useCommonDataContext();
  const {
    data: commonFeedItems,
    loading,
    hasMore,
    fetch: fetchCommonFeedItems,
  } = useCommonFeedItems(common.id);

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

  return null;
};

export default FeedItems;
