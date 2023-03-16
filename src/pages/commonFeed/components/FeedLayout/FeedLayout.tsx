import React, { FC, ReactNode } from "react";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { CommonSidenavLayoutPageContent } from "@/shared/layouts";
import { CommonFeed, Governance } from "@/shared/models";
import { InfiniteScroll } from "@/shared/ui-kit";
import { FeedItem } from "../../../common/components";
import styles from "./FeedLayout.module.scss";

interface FeedLayoutProps {
  headerContent: ReactNode;
  isGlobalLoading?: boolean;
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
    isGlobalLoading,
    commonId,
    governance,
    userCircleIds,
    feedItems,
    loading,
    onFetchNext,
  } = props;
  const isTabletView = useIsTabletView();

  return (
    <CommonSidenavLayoutPageContent
      headerContent={headerContent}
      isGlobalLoading={isGlobalLoading}
    >
      <div className={styles.content}>
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
      </div>
    </CommonSidenavLayoutPageContent>
  );
};

export default FeedLayout;
