import React, { FC, useEffect } from "react";
import { useCommonDataContext } from "@/pages/common/providers";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { useCommonFeedItems } from "@/shared/hooks/useCases";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Container, InfiniteScroll } from "@/shared/ui-kit";
import { FeedItem } from "./component";
import styles from "./FeedItems.module.scss";

interface FeedItemsProps {
  userCircleIds: string[];
}

const FeedItems: FC<FeedItemsProps> = (props) => {
  const { userCircleIds } = props;
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
    <Container
      className={styles.container}
      viewports={[
        ViewportBreakpointVariant.Tablet,
        ViewportBreakpointVariant.PhoneOriented,
        ViewportBreakpointVariant.Phone,
      ]}
    >
      <InfiniteScroll onFetchNext={fetchMore} isLoading={loading}>
        {commonFeedItems?.map((item) => (
          <FeedItem
            key={item.id}
            governanceId={governance.id}
            commonId={common.id}
            item={item}
            governanceCircles={governance.circles}
            isMobileVersion={isTabletView}
            userCircleIds={userCircleIds}
          />
        ))}
      </InfiniteScroll>
    </Container>
  );
};

export default FeedItems;
