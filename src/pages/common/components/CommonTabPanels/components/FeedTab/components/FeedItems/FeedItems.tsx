import React, { FC, useEffect, useRef } from "react";
import { useCommonDataContext } from "@/pages/common/providers";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { useViewPortHook } from "@/shared/hooks";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Container } from "@/shared/ui-kit";
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
  const anchorRef = useRef<HTMLDivElement>(null);
  const isAnchorVisible = useViewPortHook(anchorRef.current);

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

  useEffect(() => {
    if (isAnchorVisible && !loading) {
      fetchMore();
    }
  }, [isAnchorVisible]);

  return (
    <Container
      className={styles.container}
      viewports={[
        ViewportBreakpointVariant.Tablet,
        ViewportBreakpointVariant.PhoneOriented,
        ViewportBreakpointVariant.Phone,
      ]}
    >
      {commonFeedItems?.map((item) => (
        <FeedItem
          key={item.id}
          commonId={common.id}
          item={item}
          governanceCircles={governance.circles}
          isMobileVersion={isTabletView}
        />
      ))}
      <div ref={anchorRef} />
    </Container>
  );
};

export default FeedItems;
