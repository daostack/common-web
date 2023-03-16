import React, { FC, ReactNode, useMemo, useState } from "react";
import { ChatContext, ChatItem } from "@/pages/common/components/ChatComponent";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { CommonSidenavLayoutPageContent } from "@/shared/layouts";
import { CommonFeed, Governance } from "@/shared/models";
import { InfiniteScroll } from "@/shared/ui-kit";
import { FeedItem } from "../../../common/components";
import { DesktopChat } from "./components";
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
  const [chatItem, setChatItem] = useState<ChatItem | null>();

  const chatContextValue = useMemo(
    () => ({
      setChatItem,
      activeItemDiscussionId: chatItem?.discussion.id,
    }),
    [setChatItem, chatItem?.discussion.id],
  );

  return (
    <CommonSidenavLayoutPageContent
      headerContent={headerContent}
      isGlobalLoading={isGlobalLoading}
    >
      <ChatContext.Provider value={chatContextValue}>
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
        {chatItem && !isTabletView && <DesktopChat chatItem={chatItem} />}
      </ChatContext.Provider>
    </CommonSidenavLayoutPageContent>
  );
};

export default FeedLayout;
