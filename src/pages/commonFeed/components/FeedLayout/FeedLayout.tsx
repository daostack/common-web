import React, { FC, ReactNode, useMemo, useState } from "react";
import { ChatItem } from "@/pages/common/components/ChatComponent";
import { ChatContext } from "@/pages/common/components/ChatComponent/context";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { CommonSidenavLayoutPageContent } from "@/shared/layouts";
import {
  CirclesPermissions,
  Common,
  CommonFeed,
  CommonMember,
  Governance,
} from "@/shared/models";
import { InfiniteScroll } from "@/shared/ui-kit";
import { FeedItem } from "../../../common/components";
import { DesktopChat } from "./components";
import styles from "./FeedLayout.module.scss";

interface FeedLayoutProps {
  headerContent: ReactNode;
  isGlobalLoading?: boolean;
  common: Common;
  governance: Governance;
  commonMember: (CommonMember & CirclesPermissions) | null;
  feedItems: CommonFeed[] | null;
  loading: boolean;
  onFetchNext: () => void;
}

const FeedLayout: FC<FeedLayoutProps> = (props) => {
  const {
    headerContent,
    isGlobalLoading,
    common,
    governance,
    commonMember,
    feedItems,
    loading,
    onFetchNext,
  } = props;
  const isTabletView = useIsTabletView();
  const [chatItem, setChatItem] = useState<ChatItem | null>();
  const userCircleIds = useMemo(
    () => Object.values(commonMember?.circles.map ?? {}),
    [commonMember?.circles.map],
  );

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
                commonId={common.id}
                item={item}
                governanceCircles={governance.circles}
                isMobileVersion={isTabletView}
                userCircleIds={userCircleIds}
              />
            ))}
          </InfiniteScroll>
        </div>
        {chatItem && !isTabletView && (
          <DesktopChat
            className={styles.desktopChat}
            chatItem={chatItem}
            common={common}
            commonMember={commonMember}
          />
        )}
      </ChatContext.Provider>
    </CommonSidenavLayoutPageContent>
  );
};

export default FeedLayout;
