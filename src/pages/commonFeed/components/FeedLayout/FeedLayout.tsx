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
import { FeedItem } from "../../../common/components";
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
  isGlobalLoading?: boolean;
  common: Common;
  governance: Governance;
  commonMember: (CommonMember & CirclesPermissions) | null;
  feedItems: CommonFeed[] | null;
  loading: boolean;
  shouldHideContent?: boolean;
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
  const userCircleIds = useMemo(
    () => Object.values(commonMember?.circles.map ?? {}),
    [commonMember?.circles.map],
  );
  const feedItemIdForAutoChatOpen = useMemo(() => {
    if (isTabletView) {
      return;
    }

    const feedItem = feedItems?.find((item) =>
      [CommonFeedType.Proposal, CommonFeedType.Discussion].includes(
        item.data.type,
      ),
    );

    return feedItem?.id;
  }, [feedItems, isTabletView]);

  const selectedFeedItem = useMemo(() => {
    return feedItems?.find((item) => item.id === chatItem?.feedItemId);
  }, [feedItems, chatItem]);

  const chatContextValue = useMemo<ChatContextValue>(
    () => ({
      setChatItem,
      activeItemDiscussionId: chatItem?.discussion.id,
      feedItemIdForAutoChatOpen,
      setIsShowFeedItemDetailsModal,
      setShouldShowSeeMore,
    }),
    [setChatItem, chatItem?.discussion.id, feedItemIdForAutoChatOpen],
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

  const contentStyles = {
    "--chat-w": `${chatWidth}px`,
  } as CSSProperties;

  const contentEl = (
    <CommonSidenavLayoutPageContent
      className={styles.layoutPageContent}
      headerContent={headerContent}
      isGlobalLoading={isGlobalLoading}
    >
      <ChatContext.Provider value={chatContextValue}>
        {!shouldHideContent && (
          <div
            className={classNames(styles.content, className)}
            style={contentStyles}
          >
            <InfiniteScroll onFetchNext={onFetchNext} isLoading={loading}>
              {feedItems?.map((item) => (
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
