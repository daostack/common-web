import React, { FC, useEffect, useMemo } from "react";
import { useCommonDataContext } from "@/pages/common/providers";
import { getLastMessage } from "@/pages/commonFeed/utils";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { useCommonFeedItems } from "@/shared/hooks/useCases";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { checkIsFeedItemFollowLayoutItem } from "@/shared/interfaces";
import { Container, InfiniteScroll } from "@/shared/ui-kit";
import { checkIsProject, emptyFunction } from "@/shared/utils";
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
      getLastMessage,
      onFeedItemClick: emptyFunction,
      onInternalLinkClick: emptyFunction,
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
          {commonFeedItems?.map((item) => {
            if (!checkIsFeedItemFollowLayoutItem(item)) {
              return null;
            }

            const isPinned = (common.pinnedFeedItems || []).some(
              (pinnedItem) => pinnedItem.feedObjectId === item.feedItem.id,
            );

            return (
              <FeedItem
                key={item.feedItem.id}
                commonId={common.id}
                commonName={common.name}
                commonImage={common.image}
                commonNotion={common.notion}
                pinnedFeedItems={common.pinnedFeedItems}
                isPinned={isPinned}
                isProject={checkIsProject(common)}
                item={item.feedItem}
                governanceCircles={governance.circles}
                isMobileVersion={isTabletView}
                userCircleIds={userCircleIds}
                isPreviewMode
                directParent={common.directParent}
              />
            );
          })}
        </InfiniteScroll>
      </FeedItemContext.Provider>
    </Container>
  );
};

export default FeedItems;
