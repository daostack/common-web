import React, {
  CSSProperties,
  forwardRef,
  ForwardRefRenderFunction,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useWindowSize } from "react-use";
import classNames from "classnames";
import {
  FeedItem,
  FeedItemBaseContent,
  FeedItemContext,
  FeedItemContextValue,
} from "@/pages/common";
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
import {
  DesktopChat,
  FeedItemPreviewModal,
  MobileChat,
  SplitView,
} from "./components";
import { MIN_CHAT_WIDTH } from "./constants";
import { FeedLayoutRef } from "./types";
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
  loading: boolean;
  shouldHideContent?: boolean;
  onFetchNext: () => void;
}

const FeedLayout: ForwardRefRenderFunction<FeedLayoutRef, FeedLayoutProps> = (
  props,
  ref,
) => {
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
  const [expandedFeedItemId, setExpandedFeedItemId] = useState<string | null>(
    null,
  );
  const isChatItemSet = Boolean(chatItem);
  const maxChatSize = getSplitViewMaxSize(windowWidth);
  const activeFeedItemId = chatItem?.feedItemId;
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

  // We should try to set here only the data which rarely can be changed,
  // so we will not have extra re-renders of ALL rendered items
  const feedItemContextValue = useMemo<FeedItemContextValue>(
    () => ({
      setExpandedFeedItemId,
      renderFeedItemBaseContent: (props) => <FeedItemBaseContent {...props} />,
    }),
    [],
  );

  const chatContextValue = useMemo<ChatContextValue>(
    () => ({
      setChatItem,
      feedItemIdForAutoChatOpen,
      setIsShowFeedItemDetailsModal,
      setShouldShowSeeMore,
    }),
    [setChatItem, feedItemIdForAutoChatOpen],
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

  useImperativeHandle(ref, () => ({ setExpandedFeedItemId }), []);

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
      <FeedItemContext.Provider value={feedItemContextValue}>
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
                    isActive={item.id === activeFeedItemId}
                    isExpanded={item.id === expandedFeedItemId}
                    sizeKey={sizeKey}
                    commonMemberUserId={commonMember?.userId}
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
      </FeedItemContext.Provider>
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

export default forwardRef(FeedLayout);
