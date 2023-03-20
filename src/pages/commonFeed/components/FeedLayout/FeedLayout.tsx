import React, { FC, ReactNode, useMemo, useState } from "react";
import classNames from "classnames";
import {
  ChatContextValue,
  ChatItem,
} from "@/pages/common/components/ChatComponent";
import { ChatContext } from "@/pages/common/components/ChatComponent/context";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { CommonSidenavLayoutPageContent } from "@/shared/layouts";
import {
  CirclesPermissions,
  Common,
  CommonFeed,
  CommonFeedType,
  CommonMember,
  Governance,
} from "@/shared/models";
import { InfiniteScroll } from "@/shared/ui-kit";
import { FeedItem } from "../../../common/components";
import { DesktopChat, MobileChat } from "./components";
import styles from "./FeedLayout.module.scss";

interface FeedLayoutProps {
  className?: string;
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
    className,
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
  const feedItemIdForAutoChatOpen = useMemo(() => {
    const feedItem = feedItems?.find((item) =>
      [CommonFeedType.Proposal, CommonFeedType.Discussion].includes(
        item.data.type,
      ),
    );

    return feedItem?.id;
  }, [feedItems]);

  const chatContextValue = useMemo<ChatContextValue>(
    () => ({
      setChatItem,
      activeItemDiscussionId: chatItem?.discussion.id,
      feedItemIdForAutoChatOpen,
    }),
    [setChatItem, chatItem?.discussion.id, feedItemIdForAutoChatOpen],
  );

  return (
    <CommonSidenavLayoutPageContent
      headerContent={headerContent}
      isGlobalLoading={isGlobalLoading}
    >
      <ChatContext.Provider value={chatContextValue}>
        <div
          className={classNames(
            styles.content,
            {
              [styles.contentWithChat]: Boolean(chatItem),
            },
            className,
          )}
        >
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
          {chatItem && !isTabletView && (
            <DesktopChat
              className={styles.desktopChat}
              chatItem={chatItem}
              common={common}
              commonMember={commonMember}
            />
          )}
          {isTabletView && (
            <MobileChat
              chatItem={chatItem}
              common={common}
              commonMember={commonMember}
            />
          )}
        </div>
      </ChatContext.Provider>
    </CommonSidenavLayoutPageContent>
  );
};

export default FeedLayout;
