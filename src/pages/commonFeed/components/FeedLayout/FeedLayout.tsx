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
import { useGovernanceByCommonId } from "@/shared/hooks/useCases";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { CommonSidenavLayoutPageContent } from "@/shared/layouts";
import {
  CirclesPermissions,
  Common,
  CommonFeedType,
  CommonMember,
  Governance,
} from "@/shared/models";
import { InfiniteScroll } from "@/shared/ui-kit";
import {
  DesktopChat,
  DesktopChatPlaceholder,
  FeedItemPreviewModal,
  FollowFeedItemButton,
  MobileChat,
  SplitView,
} from "./components";
import { MIN_CHAT_WIDTH } from "./constants";
import { FeedLayoutItem, FeedLayoutRef } from "./types";
import {
  getDefaultSize,
  getItemCommonData,
  getSplitViewMaxSize,
} from "./utils";
import styles from "./FeedLayout.module.scss";

interface FeedLayoutProps {
  className?: string;
  headerContent: ReactNode;
  topContent?: ReactNode;
  isGlobalLoading?: boolean;
  common?: Common;
  governance?: Governance;
  commonMember: (CommonMember & CirclesPermissions) | null;
  feedItems: FeedLayoutItem[] | null;
  topFeedItems?: FeedLayoutItem[];
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
    common: outerCommon,
    governance: outerGovernance,
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
  const { data: fetchedGovernance, fetchGovernance } =
    useGovernanceByCommonId();
  const governance = outerGovernance || fetchedGovernance;
  const maxChatSize = getSplitViewMaxSize(windowWidth);
  const defaultChatSize = useMemo(
    () => getDefaultSize(windowWidth, maxChatSize),
    [],
  );
  const [chatWidth, setChatWidth] = useState(defaultChatSize);
  const [expandedFeedItemId, setExpandedFeedItemId] = useState<string | null>(
    null,
  );
  const allFeedItems = useMemo(() => {
    const items: FeedLayoutItem[] = [];

    if (topFeedItems) {
      items.push(...topFeedItems);
    }
    if (feedItems) {
      items.push(...feedItems);
    }

    return items;
  }, [topFeedItems, feedItems]);
  const feedItemIdForAutoChatOpen = useMemo(() => {
    if (isTabletView) {
      return;
    }

    const foundItem = allFeedItems?.find((item) =>
      [CommonFeedType.Proposal, CommonFeedType.Discussion].includes(
        item.feedItem.data.type,
      ),
    );

    return foundItem?.feedItem.id;
  }, [allFeedItems, isTabletView]);
  const activeFeedItemId = chatItem?.feedItemId || feedItemIdForAutoChatOpen;
  const sizeKey = `${windowWidth}_${chatWidth}`;
  const userCircleIds = useMemo(
    () => Object.values(commonMember?.circles.map ?? {}),
    [commonMember?.circles.map],
  );

  const selectedFeedItem = useMemo(() => {
    return allFeedItems?.find(
      (item) => item.feedItem.id === chatItem?.feedItemId,
    );
  }, [allFeedItems, chatItem?.feedItemId]);
  const selectedItemCommonData = getItemCommonData(
    selectedFeedItem?.feedItemFollowWithMetadata,
    outerCommon,
  );

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
    if (chatWidth > maxChatSize) {
      setChatWidth(maxChatSize);
    }
  }, [maxChatSize]);

  useEffect(() => {
    if (!outerGovernance && selectedItemCommonData?.id) {
      fetchGovernance(selectedItemCommonData.id);
    }
  }, [outerGovernance, selectedItemCommonData?.id]);

  useImperativeHandle(ref, () => ({ setExpandedFeedItemId }), []);

  const pageContentStyles = {
    "--chat-w": `${chatWidth}px`,
  } as CSSProperties;

  const followFeedItemEl =
    commonMember && activeFeedItemId && selectedItemCommonData ? (
      <FollowFeedItemButton
        feedItemId={activeFeedItemId}
        commonId={selectedItemCommonData.id}
      />
    ) : null;
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
                {allFeedItems?.map((item) => {
                  const isActive = item.feedItem.id === activeFeedItemId;
                  const commonData = getItemCommonData(
                    item.feedItemFollowWithMetadata,
                    outerCommon,
                  );

                  return (
                    <FeedItem
                      key={item.feedItem.id}
                      commonId={commonData?.id}
                      commonName={commonData?.name || ""}
                      isProject={commonData?.isProject}
                      item={item.feedItem}
                      governanceCircles={governance?.circles}
                      isMobileVersion={isTabletView}
                      userCircleIds={userCircleIds}
                      isActive={isActive}
                      isExpanded={item.feedItem.id === expandedFeedItemId}
                      sizeKey={isActive ? sizeKey : undefined}
                      commonMemberUserId={commonMember?.userId}
                    />
                  );
                })}
              </InfiniteScroll>
              {!isTabletView &&
                (chatItem && selectedItemCommonData ? (
                  <DesktopChat
                    className={styles.desktopChat}
                    chatItem={chatItem}
                    commonId={selectedItemCommonData.id}
                    governanceCircles={governance?.circles}
                    commonMember={commonMember}
                    titleRightContent={followFeedItemEl}
                  />
                ) : (
                  <DesktopChatPlaceholder className={styles.desktopChat} />
                ))}
              {isTabletView && selectedItemCommonData && (
                <MobileChat
                  chatItem={chatItem}
                  commonId={selectedItemCommonData.id}
                  commonName={selectedItemCommonData.name}
                  commonImage={selectedItemCommonData.image}
                  governanceCircles={governance?.circles}
                  commonMember={commonMember}
                  shouldShowSeeMore={shouldShowSeeMore}
                  rightHeaderContent={followFeedItemEl}
                >
                  <FeedItemPreviewModal
                    commonId={selectedItemCommonData.id}
                    commonName={selectedItemCommonData.name}
                    isProject={selectedItemCommonData.isProject}
                    governanceCircles={governance?.circles}
                    selectedFeedItem={selectedFeedItem?.feedItem}
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
      minSize={MIN_CHAT_WIDTH}
      maxSize={maxChatSize}
      defaultSize={defaultChatSize}
      onChange={setChatWidth}
    >
      {contentEl}
    </SplitView>
  );
};

export default forwardRef(FeedLayout);
