import React, { FC, ReactNode } from "react";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { CommonSidenavLayoutPageContent } from "@/shared/layouts";
import { CommonFeed, Governance } from "@/shared/models";
import { InfiniteScroll } from "@/shared/ui-kit";
import { FeedItem } from "../../../common/components";

interface FeedLayoutProps {
  headerContent: ReactNode;
  commonId: string;
  governance: Governance;
  userCircleIds: string[];
  feedItems: CommonFeed[] | null;
  loading: boolean;
  onFetchNext: () => void;
}

const FeedLayout: FC<FeedLayoutProps> = (props) => {
  const {
    headerContent,
    commonId,
    governance,
    userCircleIds,
    feedItems,
    loading,
    onFetchNext,
  } = props;
  const isTabletView = useIsTabletView();

  return (
    <CommonSidenavLayoutPageContent headerContent={headerContent}>
      <InfiniteScroll onFetchNext={onFetchNext} isLoading={loading}>
        {feedItems?.map((item) => (
          <FeedItem
            key={item.id}
            governanceId={governance.id}
            commonId={commonId}
            item={item}
            governanceCircles={governance.circles}
            isMobileVersion={isTabletView}
            userCircleIds={userCircleIds}
          />
        ))}
      </InfiniteScroll>
    </CommonSidenavLayoutPageContent>
  );
};

export default FeedLayout;
