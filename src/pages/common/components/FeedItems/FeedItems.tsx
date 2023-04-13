import React, { FC, useEffect, useMemo } from "react";
import { useCommonDataContext } from "@/pages/common/providers";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { useCommonFeedItems } from "@/shared/hooks/useCases";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Container, InfiniteScroll } from "@/shared/ui-kit";
import { checkIsProject } from "@/shared/utils";
import { FeedItem, FeedItemContext, FeedItemContextValue } from "../FeedItem";
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
  const feedItemContextValue = useMemo<FeedItemContextValue>(
    () => ({
      feedCardSettings: {
        commonCardClassName: styles.commonCardClassName,
        shouldHideCardStyles: false,
        withHovering: true,
      },
    }),
    [],
  );

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
      <FeedItemContext.Provider value={feedItemContextValue}>
        <InfiniteScroll onFetchNext={fetchMore} isLoading={loading}>
          {commonFeedItems?.map((item) => (
            <FeedItem
              key={item.feedItem.id}
              commonId={common.id}
              commonName={common.name}
              isProject={checkIsProject(common)}
              item={item.feedItem}
              governanceCircles={governance.circles}
              isMobileVersion={isTabletView}
              userCircleIds={userCircleIds}
              isPreviewMode
            />
          ))}
        </InfiniteScroll>
      </FeedItemContext.Provider>
    </Container>
  );
};

export default FeedItems;
