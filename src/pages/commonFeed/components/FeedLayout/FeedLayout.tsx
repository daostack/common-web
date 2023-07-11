import React, {
  CSSProperties,
  forwardRef,
  ForwardRefRenderFunction,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { useWindowSize } from "react-use";
import classNames from "classnames";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import {
  FeedItem,
  FeedItemBaseContentProps,
  FeedItemContext,
  FeedItemContextValue,
  GetLastMessageOptions,
  GetNonAllowedItemsOptions,
} from "@/pages/common";
import {
  ChatContextValue,
  ChatItem,
} from "@/pages/common/components/ChatComponent";
import { ChatContext } from "@/pages/common/components/ChatComponent/context";
import { InboxItemType } from "@/shared/constants";
import { useGovernanceByCommonId } from "@/shared/hooks/useCases";
import { useIsTabletView } from "@/shared/hooks/viewport";
import {
  ChatChannelFeedLayoutItemProps,
  checkIsChatChannelLayoutItem,
  checkIsFeedItemFollowLayoutItem,
  FeedLayoutItem,
  FeedLayoutItemChangeData,
  FeedLayoutItemChangeDataWithType,
  FeedLayoutRef,
} from "@/shared/interfaces";
import {
  CirclesPermissions,
  Common,
  CommonFeed,
  CommonFeedType,
  CommonMember,
  Governance,
} from "@/shared/models";
import { InfiniteScroll, TextEditorValue } from "@/shared/ui-kit";
import { selectRecentStreamId } from "@/store/states";
import { MIN_CHAT_WIDTH } from "../../constants";
import {
  DesktopChat,
  DesktopChatPlaceholder,
  FeedItemPreviewModal,
  FollowFeedItemButton,
  MobileChat,
  SplitView,
} from "./components";
import {
  getDefaultSize,
  getItemCommonData,
  getSplitViewMaxSize,
  saveChatSize,
} from "./utils";
import styles from "./FeedLayout.module.scss";

export interface FeedLayoutOuterStyles {
  splitView?: string;
  desktopChat?: string;
}

export interface FeedLayoutSettings {
  withDesktopChatTitle?: boolean;
  sidenavWidth?: number;
  getSplitViewMaxSize?: (width: number) => number;
}

interface FeedLayoutProps {
  className?: string;
  renderContentWrapper: (
    children: ReactNode,
    wrapperStyles?: CSSProperties,
  ) => ReactNode;
  topContent?: ReactNode;
  common?: Common;
  governance?: Governance;
  commonMember: (CommonMember & CirclesPermissions) | null;
  feedItems: FeedLayoutItem[] | null;
  topFeedItems?: FeedLayoutItem[];
  loading: boolean;
  shouldHideContent?: boolean;
  onFetchNext: () => void;
  renderFeedItemBaseContent: (props: FeedItemBaseContentProps) => ReactNode;
  renderChatChannelItem?: (props: ChatChannelFeedLayoutItemProps) => ReactNode;
  onFeedItemUpdate?: (item: CommonFeed, isRemoved: boolean) => void;
  getLastMessage: (options: GetLastMessageOptions) => TextEditorValue;
  sharedFeedItemId?: string | null;
  emptyText?: string;
  getNonAllowedItems?: GetNonAllowedItemsOptions;
  onActiveItemChange?: (itemId?: string) => void;
  onActiveItemDataChange?: (data: FeedLayoutItemChangeDataWithType) => void;
  onMessagesAmountEmptinessToggle?: (
    feedItem: FeedLayoutItem,
    becameEmpty: boolean,
  ) => void;
  outerStyles?: FeedLayoutOuterStyles;
  settings?: FeedLayoutSettings;
}

const FeedLayout: ForwardRefRenderFunction<FeedLayoutRef, FeedLayoutProps> = (
  props,
  ref,
) => {
  const {
    className,
    renderContentWrapper,
    topContent,
    common: outerCommon,
    governance: outerGovernance,
    commonMember: outerCommonMember,
    feedItems,
    topFeedItems = [],
    loading,
    shouldHideContent = false,
    onFetchNext,
    renderFeedItemBaseContent,
    renderChatChannelItem,
    onFeedItemUpdate,
    getLastMessage,
    sharedFeedItemId,
    emptyText,
    getNonAllowedItems,
    onActiveItemChange,
    onActiveItemDataChange,
    onMessagesAmountEmptinessToggle,
    outerStyles,
    settings,
  } = props;
  const { width: windowWidth } = useWindowSize();
  const isTabletView = useIsTabletView();
  const user = useSelector(selectUser());
  const recentStreamId = useSelector(selectRecentStreamId);
  const userId = user?.uid;
  const [chatItem, setChatItem] = useState<ChatItem | null>();
  const [isShowFeedItemDetailsModal, setIsShowFeedItemDetailsModal] =
    useState(false);
  const [shouldShowSeeMore, setShouldShowSeeMore] = useState(true);
  const { data: fetchedGovernance, fetchGovernance } =
    useGovernanceByCommonId();
  const {
    data: fetchedCommonMember,
    fetchCommonMember,
    setCommonMember,
  } = useCommonMember({
    shouldAutoReset: false,
  });
  const governance = outerGovernance || fetchedGovernance;
  const commonMember = outerCommonMember || fetchedCommonMember;
  const maxChatSize =
    settings?.getSplitViewMaxSize?.(windowWidth) ??
    getSplitViewMaxSize(windowWidth);
  const [realChatWidth, setRealChatWidth] = useState(() =>
    getDefaultSize(windowWidth, maxChatSize, settings?.sidenavWidth),
  );
  const chatWidth = Math.min(realChatWidth, maxChatSize);
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
  const isContentEmpty =
    !loading && (!allFeedItems || allFeedItems.length === 0) && emptyText;

  const feedItemIdForAutoChatOpen = useMemo(() => {
    if (recentStreamId) {
      const foundItem = allFeedItems.find(
        (item) =>
          checkIsFeedItemFollowLayoutItem(item) &&
          item.feedItem.data.id === recentStreamId,
      );
      return foundItem?.itemId;
    }

    if (sharedFeedItemId) {
      return sharedFeedItemId;
    }

    if (chatItem?.feedItemId) {
      return;
    }

    const foundItem = allFeedItems?.find(
      (item) =>
        !checkIsFeedItemFollowLayoutItem(item) ||
        [CommonFeedType.Proposal, CommonFeedType.Discussion].includes(
          item.feedItem.data.type,
        ),
    );

    return foundItem?.itemId;
  }, [allFeedItems, chatItem?.feedItemId, recentStreamId, sharedFeedItemId]);
  const activeFeedItemId = chatItem?.feedItemId || feedItemIdForAutoChatOpen;
  const sizeKey = `${windowWidth}_${chatWidth}`;
  const userCircleIds = useMemo(
    () => Object.values(commonMember?.circles.map ?? {}),
    [commonMember?.circles.map],
  );

  const selectedFeedItem = useMemo(
    () => allFeedItems?.find((item) => item.itemId === activeFeedItemId),
    [allFeedItems, activeFeedItemId],
  );
  const selectedItemCommonData = checkIsFeedItemFollowLayoutItem(
    selectedFeedItem,
  )
    ? getItemCommonData(
        selectedFeedItem?.feedItemFollowWithMetadata,
        outerCommon,
      )
    : null;

  // We should try to set here only the data which rarely can be changed,
  // so we will not have extra re-renders of ALL rendered items
  const feedItemContextValue = useMemo<FeedItemContextValue>(
    () => ({
      setExpandedFeedItemId,
      renderFeedItemBaseContent,
      onFeedItemUpdate,
      getLastMessage,
      getNonAllowedItems,
    }),
    [
      renderFeedItemBaseContent,
      onFeedItemUpdate,
      getLastMessage,
      getNonAllowedItems,
    ],
  );

  const setActiveChatItem = useCallback((nextChatItem: ChatItem | null) => {
    setExpandedFeedItemId(null);
    setChatItem(nextChatItem);
  }, []);

  const chatContextValue = useMemo<ChatContextValue>(
    () => ({
      setChatItem: setActiveChatItem,
      feedItemIdForAutoChatOpen,
      setIsShowFeedItemDetailsModal,
      setShouldShowSeeMore,
    }),
    [setActiveChatItem, feedItemIdForAutoChatOpen],
  );

  const setActiveItem = useCallback((item: ChatItem) => {
    setChatItem(item);
    setExpandedFeedItemId(item.feedItemId);
  }, []);

  const handleMessagesAmountChange = useCallback(
    (newMessagesAmount: number) => {
      if (
        !checkIsChatChannelLayoutItem(selectedFeedItem) ||
        !onMessagesAmountEmptinessToggle
      ) {
        return;
      }

      const becameEmpty =
        newMessagesAmount === 0 &&
        selectedFeedItem.chatChannel.messageCount > 0;
      const becameNonEmpty =
        newMessagesAmount > 0 &&
        selectedFeedItem.chatChannel.messageCount === 0;

      if (becameEmpty || becameNonEmpty) {
        onMessagesAmountEmptinessToggle(selectedFeedItem, becameEmpty);
      }
    },
    [selectedFeedItem, onMessagesAmountEmptinessToggle],
  );

  const handleActiveFeedItemDataChange = (
    data: FeedLayoutItemChangeData,
    commonId?: string,
  ) => {
    if (commonId) {
      onActiveItemDataChange?.({
        ...data,
        type: InboxItemType.FeedItemFollow,
        commonId,
      });
    }
  };

  const handleActiveChatChannelItemDataChange = (
    data: FeedLayoutItemChangeData,
  ) => {
    onActiveItemDataChange?.({
      ...data,
      type: InboxItemType.ChatChannel,
    });
  };

  useEffect(() => {
    if (!outerGovernance && selectedItemCommonData?.id) {
      fetchGovernance(selectedItemCommonData.id);
    }
  }, [outerGovernance, selectedItemCommonData?.id]);

  useEffect(() => {
    if (selectedItemCommonData?.id) {
      fetchCommonMember(selectedItemCommonData.id, {}, true);
    } else {
      setCommonMember(null);
    }
  }, [selectedItemCommonData?.id, userId]);

  useEffect(() => {
    saveChatSize(chatWidth);
  }, [chatWidth]);

  useEffect(() => {
    onActiveItemChange?.(activeFeedItemId);
  }, [activeFeedItemId]);

  useImperativeHandle(
    ref,
    () => ({
      setExpandedFeedItemId,
      setActiveItem,
    }),
    [setActiveItem],
  );

  const pageContentStyles = {
    "--chat-w": `${chatWidth}px`,
  } as CSSProperties;

  const followFeedItemEl =
    (commonMember ||
      (checkIsFeedItemFollowLayoutItem(selectedFeedItem) &&
        selectedFeedItem?.feedItemFollowWithMetadata)) &&
    activeFeedItemId &&
    selectedItemCommonData ? (
      <FollowFeedItemButton
        feedItemId={activeFeedItemId}
        commonId={selectedItemCommonData.id}
      />
    ) : null;
  const contentEl = renderContentWrapper(
    <FeedItemContext.Provider value={feedItemContextValue}>
      <ChatContext.Provider value={chatContextValue}>
        {!shouldHideContent && (
          <div
            className={classNames(styles.content, className, {
              [styles.contentCentered]: isContentEmpty,
            })}
          >
            {topContent}
            {isContentEmpty && <p className={styles.emptyText}>{emptyText}</p>}
            <InfiniteScroll onFetchNext={onFetchNext} isLoading={loading}>
              {allFeedItems?.map((item) => {
                const isActive = item.itemId === activeFeedItemId;

                if (checkIsFeedItemFollowLayoutItem(item)) {
                  const commonData = getItemCommonData(
                    item.feedItemFollowWithMetadata,
                    outerCommon,
                  );
                  const isPinned = (outerCommon?.pinnedFeedItems || []).some(
                    (pinnedItem) =>
                      pinnedItem.feedObjectId === item.feedItem.id,
                  );

                  return (
                    <FeedItem
                      key={item.feedItem.id}
                      commonMember={commonMember}
                      commonId={commonData?.id}
                      commonName={commonData?.name || ""}
                      commonImage={commonData?.image || ""}
                      pinnedFeedItems={outerCommon?.pinnedFeedItems}
                      isProject={commonData?.isProject}
                      isPinned={isPinned}
                      item={item.feedItem}
                      governanceCircles={governance?.circles}
                      isMobileVersion={isTabletView}
                      userCircleIds={userCircleIds}
                      isActive={isActive}
                      isExpanded={item.feedItem.id === expandedFeedItemId}
                      sizeKey={isActive ? sizeKey : undefined}
                      currentUserId={userId}
                      onActiveItemDataChange={(...args) =>
                        handleActiveFeedItemDataChange(...args, commonData?.id)
                      }
                    />
                  );
                }
                if (
                  renderChatChannelItem &&
                  checkIsChatChannelLayoutItem(item)
                ) {
                  return (
                    <React.Fragment key={item.itemId}>
                      {renderChatChannelItem({
                        chatChannel: item.chatChannel,
                        isActive,
                        onActiveItemDataChange:
                          handleActiveChatChannelItemDataChange,
                      })}
                    </React.Fragment>
                  );
                }
              })}
            </InfiniteScroll>
            {!isTabletView &&
              (chatItem ? (
                <DesktopChat
                  className={classNames(
                    styles.desktopChat,
                    outerStyles?.desktopChat,
                  )}
                  chatItem={chatItem}
                  commonId={selectedItemCommonData?.id || ""}
                  governanceCircles={governance?.circles}
                  commonMember={commonMember}
                  withTitle={settings?.withDesktopChatTitle}
                  titleRightContent={followFeedItemEl}
                  onMessagesAmountChange={handleMessagesAmountChange}
                />
              ) : (
                <DesktopChatPlaceholder
                  className={styles.desktopChat}
                  isItemSelected={Boolean(selectedItemCommonData)}
                />
              ))}
            {isTabletView && (
              <MobileChat
                chatItem={chatItem}
                commonId={selectedItemCommonData?.id || ""}
                commonName={selectedItemCommonData?.name || ""}
                commonImage={selectedItemCommonData?.image || ""}
                governanceCircles={governance?.circles}
                commonMember={commonMember}
                shouldShowSeeMore={!chatItem?.chatChannel && shouldShowSeeMore}
                rightHeaderContent={followFeedItemEl}
                onMessagesAmountChange={handleMessagesAmountChange}
              >
                {selectedItemCommonData &&
                  checkIsFeedItemFollowLayoutItem(selectedFeedItem) && (
                    <FeedItemPreviewModal
                      commonId={selectedItemCommonData.id}
                      commonName={selectedItemCommonData.name}
                      commonImage={selectedItemCommonData.image}
                      isProject={selectedItemCommonData.isProject}
                      governanceCircles={governance?.circles}
                      selectedFeedItem={selectedFeedItem?.feedItem}
                      userCircleIds={userCircleIds}
                      isShowFeedItemDetailsModal={isShowFeedItemDetailsModal}
                      sizeKey={sizeKey}
                    />
                  )}
              </MobileChat>
            )}
          </div>
        )}
      </ChatContext.Provider>
    </FeedItemContext.Provider>,
    pageContentStyles,
  );

  return isTabletView ? (
    <>{contentEl}</>
  ) : (
    <SplitView
      className={outerStyles?.splitView}
      size={chatWidth}
      minSize={MIN_CHAT_WIDTH}
      maxSize={maxChatSize}
      onChange={setRealChatWidth}
    >
      {contentEl}
    </SplitView>
  );
};

export default forwardRef(FeedLayout);
