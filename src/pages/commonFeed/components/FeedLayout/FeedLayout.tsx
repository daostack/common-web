import React, {
  CSSProperties,
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useWindowSize } from "react-use";
import classNames from "classnames";
import {
  ChatContextValue,
  ChatItem,
} from "@/pages/common/components/ChatComponent";
import { ChatContext } from "@/pages/common/components/ChatComponent/context";
import { FeedItem } from "@/pages/common/components/CommonTabPanels/components/FeedTab/components";
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
import { checkIsProject } from "@/shared/utils";
import {
  DesktopChat,
  FeedItemPreviewModal,
  MobileChat,
  SplitView,
} from "./components";
import { MIN_CHAT_WIDTH } from "./constants";
import { getSplitViewMaxSize } from "./utils";
import styles from "./FeedLayout.module.scss";

interface FeedLayoutProps {
  className?: string;
  headerContent: ReactNode;
  topContent?: ReactNode;
  isGlobalLoading?: boolean;
  common: Common;
  governance: Governance;
  commonMember: (CommonMember & CirclesPermissions) | null;
  feedItems: CommonFeed[] | null;
  topFeedItems?: CommonFeed[];
  expandedFeedItemId?: string | null;
  loading: boolean;
  shouldHideContent?: boolean;
  onFetchNext: () => void;
}

const FeedLayout: FC<FeedLayoutProps> = (props) => {
  const {
    className,
    headerContent,
    topContent,
    isGlobalLoading,
    common,
    governance,
    commonMember,
    feedItems,
    topFeedItems = [],
    expandedFeedItemId,
    loading,
    shouldHideContent = false,
    onFetchNext,
  } = props;
  const { width: windowWidth } = useWindowSize();
  const isTabletView = useIsTabletView();
  const [chatItem, setChatItem] = useState<ChatItem | null>();
  const [isShowFeedItemDetailsModal, setIsShowFeedItemDetailsModal] =
    useState(false);
  const [shouldShowSeeMore, setShouldShowSeeMore] = useState(true);
  const [chatWidth, setChatWidth] = useState(0);
  const isChatItemSet = Boolean(chatItem);
  const maxChatSize = getSplitViewMaxSize(windowWidth);
  const sizeKey = `${windowWidth}_${chatWidth}`;
  const allFeedItems = useMemo(() => {
    const items: CommonFeed[] = [];

    if (topFeedItems) {
      items.push(...topFeedItems);
    }
    if (feedItems) {
      items.push(...feedItems);
    }

    return items;
  }, [topFeedItems, feedItems]);
  const userCircleIds = useMemo(
    () => Object.values(commonMember?.circles.map ?? {}),
    [commonMember?.circles.map],
  );
  const feedItemIdForAutoChatOpen = useMemo(() => {
    if (isTabletView) {
      return;
    }

    const feedItem = allFeedItems?.find((item) =>
      [CommonFeedType.Proposal, CommonFeedType.Discussion].includes(
        item.data.type,
      ),
    );

    return feedItem?.id;
  }, [allFeedItems, isTabletView]);

  const selectedFeedItem = useMemo(() => {
    return allFeedItems?.find((item) => item.id === chatItem?.feedItemId);
  }, [allFeedItems, chatItem]);

  const chatContextValue = useMemo<ChatContextValue>(
    () => ({
      setChatItem,
      activeItemDiscussionId: chatItem?.discussion.id,
      feedItemIdForAutoChatOpen,
      expandedFeedItemId,
      setIsShowFeedItemDetailsModal,
      setShouldShowSeeMore,
    }),
    [
      setChatItem,
      chatItem?.discussion.id,
      feedItemIdForAutoChatOpen,
      expandedFeedItemId,
    ],
  );

  useEffect(() => {
    if (isChatItemSet) {
      setChatWidth(MIN_CHAT_WIDTH);
    }
  }, [isChatItemSet]);

  useEffect(() => {
    if (chatWidth > maxChatSize) {
      setChatWidth(maxChatSize);
    }
  }, [maxChatSize]);

  const pageContentStyles = {
    "--chat-w": `${chatWidth}px`,
  } as CSSProperties;

  const contentEl = (
    <CommonSidenavLayoutPageContent
      className={styles.layoutPageContent}
      headerClassName={styles.layoutHeader}
      headerContent={headerContent}
      isGlobalLoading={isGlobalLoading}
      styles={pageContentStyles}
    >
      <ChatContext.Provider value={chatContextValue}>
        {!shouldHideContent && (
          <div className={classNames(styles.content, className)}>
            {topContent}
            <InfiniteScroll onFetchNext={onFetchNext} isLoading={loading}>
              {allFeedItems?.map((item) => (
                <FeedItem
                  key={item.id}
                  governanceId={governance.id}
                  commonId={common.id}
                  commonName={common.name}
                  isProject={checkIsProject(common)}
                  item={item}
                  governanceCircles={governance.circles}
                  isMobileVersion={isTabletView}
                  userCircleIds={userCircleIds}
                  isActive={item.id === chatItem?.feedItemId}
                  sizeKey={sizeKey}
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
                shouldShowSeeMore={shouldShowSeeMore}
              >
                <FeedItemPreviewModal
                  common={common}
                  governance={governance}
                  selectedFeedItem={selectedFeedItem}
                  userCircleIds={userCircleIds}
                  isShowFeedItemDetailsModal={isShowFeedItemDetailsModal}
                  sizeKey={sizeKey}
                />
              </MobileChat>
            )}
          </div>
        )}
      </ChatContext.Provider>
    </CommonSidenavLayoutPageContent>
  );

  return isTabletView ? (
    contentEl
  ) : (
    <SplitView
      minSize={isChatItemSet ? MIN_CHAT_WIDTH : 0}
      maxSize={maxChatSize}
      onChange={setChatWidth}
    >
      {contentEl}
    </SplitView>
  );
};

export default FeedLayout;
