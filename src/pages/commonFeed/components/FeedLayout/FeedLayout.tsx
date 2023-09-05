import React, {
  CSSProperties,
  forwardRef,
  ForwardRefRenderFunction,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useWindowSize } from "react-use";
import classNames from "classnames";
import { selectUser } from "@/pages/Auth/store/selectors";
import { MembershipRequestModal } from "@/pages/OldCommon/components";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import {
  FeedItem,
  FeedItemBaseContentProps,
  FeedItemContext,
  FeedItemContextValue,
  FeedItemRef,
  GetLastMessageOptions,
  GetNonAllowedItemsOptions,
} from "@/pages/common";
import {
  ChatContextValue,
  ChatItem,
} from "@/pages/common/components/ChatComponent";
import { ChatContext } from "@/pages/common/components/ChatComponent/context";
import { JoinProjectModal } from "@/pages/common/components/JoinProjectModal";
import { useJoinProjectAutomatically } from "@/pages/common/hooks";
import { InternalLinkData } from "@/shared/components";
import { InboxItemType, QueryParamKey, ROUTE_PATHS } from "@/shared/constants";
import { useRoutesContext } from "@/shared/contexts";
import { useAuthorizedModal, useQueryParams } from "@/shared/hooks";
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
  ChatChannel,
  CirclesPermissions,
  Common,
  CommonFeed,
  CommonFeedType,
  CommonMember,
  Governance,
  User,
} from "@/shared/models";
import { InfiniteScroll, TextEditorValue } from "@/shared/ui-kit";
import {
  addQueryParam,
  checkIsProject,
  deleteQueryParam,
  getParamsFromOneOfRoutes,
  getUserName,
} from "@/shared/utils";
import { commonActions, selectRecentStreamId } from "@/store/states";
import { MIN_CHAT_WIDTH } from "../../constants";
import {
  DesktopChat,
  DesktopChatPlaceholder,
  DesktopProfile,
  FeedItemPreviewModal,
  FollowFeedItemButton,
  MobileChat,
  MobileProfile,
  SplitView,
} from "./components";
import { useUserForProfile } from "./hooks";
import {
  checkShouldAutoOpenPreview,
  getChatChannelItemByUserIds,
  getDefaultSize,
  getItemCommonData,
  getSplitViewMaxSize,
  saveChatSize,
} from "./utils";
import styles from "./FeedLayout.module.scss";

export interface FeedLayoutOuterStyles {
  splitView?: string;
  desktopRightPane?: string;
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
  parentCommon?: Common;
  governance?: Governance;
  commonMember: (CommonMember & CirclesPermissions) | null;
  feedItems: FeedLayoutItem[] | null;
  topFeedItems?: FeedLayoutItem[];
  loading: boolean;
  shouldHideContent?: boolean;
  onFetchNext: (feedItemId?: string) => void;
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
  onFeedItemSelect?: (
    commonId: string,
    feedItemId: string,
    messageId?: string,
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
    parentCommon,
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
    onFeedItemSelect,
    outerStyles,
    settings,
  } = props;
  const dispatch = useDispatch();
  const { getCommonPagePath } = useRoutesContext();
  const refsByItemId = useRef<Record<string, FeedItemRef | null>>({});
  const { width: windowWidth } = useWindowSize();
  const history = useHistory();
  const queryParams = useQueryParams();
  const isTabletView = useIsTabletView();
  const user = useSelector(selectUser());
  const recentStreamId = useSelector(selectRecentStreamId);
  const userId = user?.uid;
  const [chatItem, setChatItem] = useState<ChatItem | null>();
  const [isShowFeedItemDetailsModal, setIsShowFeedItemDetailsModal] =
    useState(false);
  const [shouldShowSeeMore, setShouldShowSeeMore] = useState(true);
  const [shouldAllowChatAutoOpen, setShouldAllowChatAutoOpen] = useState<
    boolean | null
  >(null);
  const { data: fetchedGovernance, fetchGovernance } =
    useGovernanceByCommonId();
  const {
    data: fetchedCommonMember,
    fetchCommonMember,
    setCommonMember,
  } = useCommonMember({
    shouldAutoReset: false,
  });
  const {
    isModalOpen: isCommonJoinModalOpen,
    onOpen: onCommonJoinModalOpen,
    onClose: onCommonJoinModalClose,
  } = useAuthorizedModal();
  const {
    isModalOpen: isProjectJoinModalOpen,
    onOpen: onProjectJoinModalOpen,
    onClose: onProjectJoinModalClose,
  } = useAuthorizedModal();
  const commonMember = outerCommonMember || fetchedCommonMember;
  const {
    canJoinProjectAutomatically,
    isJoinPending,
    onJoinProjectAutomatically,
  } = useJoinProjectAutomatically(commonMember, outerCommon, parentCommon);
  const onJoinCommon = checkIsProject(outerCommon)
    ? canJoinProjectAutomatically
      ? onJoinProjectAutomatically
      : onProjectJoinModalOpen
    : onCommonJoinModalOpen;
  const userForProfile = useUserForProfile();
  const governance = outerGovernance || fetchedGovernance;
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
  const chatChannelItemForProfile = useMemo(
    () =>
      getChatChannelItemByUserIds(
        allFeedItems,
        userId,
        userForProfile.userForProfileData?.userId,
      ),
    [allFeedItems, userId, userForProfile.userForProfileData?.userId],
  );
  const isContentEmpty =
    !loading && (!allFeedItems || allFeedItems.length === 0) && emptyText;
  const chatItemQueryParam = queryParams[QueryParamKey.ChatItem];
  const chatItemIdFromQueryParam =
    (typeof chatItemQueryParam === "string" && chatItemQueryParam) || null;
  const shouldAutoExpandItem = checkShouldAutoOpenPreview(chatItem);
  const desktopRightPaneClassName = classNames(
    styles.desktopRightPane,
    outerStyles?.desktopRightPane,
  );

  const feedItemIdForAutoChatOpen = useMemo(() => {
    if (chatChannelItemForProfile?.itemId) {
      return chatChannelItemForProfile.itemId;
    }
    if (
      userForProfile.userForProfileData ||
      shouldAllowChatAutoOpen === false
    ) {
      return;
    }
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
  }, [
    chatChannelItemForProfile?.itemId,
    allFeedItems,
    chatItem?.feedItemId,
    recentStreamId,
    sharedFeedItemId,
    userForProfile.userForProfileData,
    shouldAllowChatAutoOpen,
  ]);
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

  const handleUserWithCommonClick = useCallback(
    (userId: string, commonId?: string) => {
      userForProfile.setUserForProfileData({
        userId,
        commonId,
      });
    },
    [userForProfile.setUserForProfileData],
  );

  const handleUserClick = useCallback(
    (userId: string) => {
      handleUserWithCommonClick(userId, selectedItemCommonData?.id);
    },
    [handleUserWithCommonClick, selectedItemCommonData?.id],
  );

  // We should try to set here only the data which rarely can be changed,
  // so we will not have extra re-renders of ALL rendered items
  const feedItemContextValue = useMemo<FeedItemContextValue>(
    () => ({
      setExpandedFeedItemId,
      renderFeedItemBaseContent,
      onFeedItemUpdate,
      getLastMessage,
      getNonAllowedItems,
      onUserSelect: handleUserWithCommonClick,
    }),
    [
      renderFeedItemBaseContent,
      onFeedItemUpdate,
      getLastMessage,
      getNonAllowedItems,
      handleUserWithCommonClick,
    ],
  );

  const setActiveChatItem = useCallback((nextChatItem: ChatItem | null) => {
    setShouldAllowChatAutoOpen(false);
    setExpandedFeedItemId((currentExpandedFeedItemId) =>
      currentExpandedFeedItemId === nextChatItem?.feedItemId
        ? currentExpandedFeedItemId
        : null,
    );
    setChatItem(nextChatItem);
  }, []);

  const chatContextValue = useMemo<ChatContextValue>(
    () => ({
      setChatItem: setActiveChatItem,
      feedItemIdForAutoChatOpen,
      shouldAllowChatAutoOpen,
      setIsShowFeedItemDetailsModal,
      setShouldShowSeeMore,
    }),
    [setActiveChatItem, feedItemIdForAutoChatOpen, shouldAllowChatAutoOpen],
  );

  const setActiveItem = useCallback((item: ChatItem) => {
    setShouldAllowChatAutoOpen(false);
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

  const handleActiveFeedItemDataChange = useCallback(
    (data: FeedLayoutItemChangeData, commonId?: string) => {
      if (commonId) {
        onActiveItemDataChange?.({
          ...data,
          type: InboxItemType.FeedItemFollow,
          commonId,
        });
      }
    },
    [onActiveItemDataChange],
  );

  const handleActiveChatChannelItemDataChange = (
    data: FeedLayoutItemChangeData,
  ) => {
    onActiveItemDataChange?.({
      ...data,
      type: InboxItemType.ChatChannel,
    });
  };

  const handleMobileChatClose = (shouldChangeHistory = true) => {
    setActiveChatItem(null);
    setShouldShowSeeMore(true);

    if (isTabletView && chatItemIdFromQueryParam && shouldChangeHistory) {
      history.goBack();
    }
  };

  const handleChatChannelCreate = (chatChannel: ChatChannel, dmUser: User) => {
    userForProfile.setChatChannel(chatChannel);
    handleActiveChatChannelItemDataChange({
      itemId: chatChannel.id,
      title: getUserName(dmUser),
      image: dmUser.photoURL,
    });

    if (!isTabletView) {
      setActiveChatItem(null);
    }
  };

  const handleProfileClose = () => {
    userForProfile.resetUserForProfileData(isTabletView);
  };

  const handleDMClick = () => {
    if (checkIsChatChannelLayoutItem(selectedFeedItem)) {
      handleProfileClose();
      return;
    }

    setActiveChatItem(null);
    setShouldAllowChatAutoOpen(true);
  };

  const onDMClick =
    checkIsChatChannelLayoutItem(selectedFeedItem) ||
    (!isTabletView && chatChannelItemForProfile)
      ? handleDMClick
      : undefined;

  const handleFeedItemClickExternal = useCallback(
    (
      feedItemId: string,
      options: { commonId?: string; messageId?: string } = {},
    ) => {
      const { commonId = selectedItemCommonData?.id, messageId } = options;

      if (commonId) {
        onFeedItemSelect?.(commonId, feedItemId, messageId);
      }
    },
    [selectedItemCommonData?.id, onFeedItemSelect],
  );

  const handleFeedItemClickInternal = (
    feedItemId: string,
    options: { commonId?: string; messageId?: string } = {},
  ) => {
    const { commonId, messageId } = options;

    if (commonId && commonId !== outerCommon?.id) {
      history.push(
        getCommonPagePath(commonId, {
          item: feedItemId,
          message: messageId,
        }),
      );
      return;
    }

    setActiveChatItem({
      feedItemId,
      circleVisibility: [],
    });

    const itemExists = allFeedItems.some((item) => item.itemId === feedItemId);

    if (itemExists) {
      refsByItemId.current[feedItemId]?.scrollToItem();
    } else {
      onFetchNext(feedItemId);
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 50);
    }
  };

  const handleFeedItemClick = onFeedItemSelect
    ? handleFeedItemClickExternal
    : handleFeedItemClickInternal;

  const handleInternalLinkClick = useCallback(
    (data: InternalLinkData) => {
      const feedPageParams = getParamsFromOneOfRoutes<{ id: string }>(
        data.pathname,
        [ROUTE_PATHS.COMMON, ROUTE_PATHS.V04_COMMON],
      );

      if (!feedPageParams) {
        return;
      }

      const itemId = data.params[QueryParamKey.Item];
      const messageId = data.params[QueryParamKey.Message];

      if (itemId) {
        handleFeedItemClick(itemId, {
          commonId: feedPageParams.id,
          messageId,
        });
        return;
      }

      history.push(
        getCommonPagePath(feedPageParams.id, {
          item: itemId,
          message: messageId,
        }),
      );
    },
    [getCommonPagePath, handleFeedItemClick],
  );

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

    if (activeFeedItemId) {
      userForProfile.resetUserForProfileData(true);
    }
  }, [activeFeedItemId]);

  useEffect(() => {
    if (selectedFeedItem?.itemId && !isTabletView) {
      refsByItemId.current[selectedFeedItem.itemId]?.scrollToItem();
    }
    if (selectedFeedItem?.itemId || (chatItem && !chatItem.discussion)) {
      return;
    }

    setActiveChatItem(null);

    if (!isTabletView) {
      setShouldAllowChatAutoOpen(true);
    }
  }, [selectedFeedItem?.itemId, isTabletView]);

  useEffect(() => {
    if (isTabletView && chatItem?.feedItemId) {
      addQueryParam(QueryParamKey.ChatItem, chatItem.feedItemId);
    }
  }, [isTabletView, chatItem?.feedItemId]);

  useEffect(() => {
    if (!chatItemIdFromQueryParam && chatItem?.feedItemId) {
      handleMobileChatClose(false);
    } else if (chatItemIdFromQueryParam && !chatItem?.feedItemId) {
      deleteQueryParam(QueryParamKey.ChatItem, true);
    }
  }, [chatItemIdFromQueryParam]);

  useEffect(() => {
    if (!isTabletView && shouldAutoExpandItem && activeFeedItemId) {
      setExpandedFeedItemId(activeFeedItemId);
    }
  }, [isTabletView, shouldAutoExpandItem, activeFeedItemId]);

  useEffect(() => {
    if (!recentStreamId || !selectedFeedItem) {
      return;
    }
    if (
      !checkIsFeedItemFollowLayoutItem(selectedFeedItem) ||
      recentStreamId === selectedFeedItem?.feedItem.data.id
    ) {
      dispatch(commonActions.setRecentStreamId(""));
    }
  }, [recentStreamId, selectedFeedItem]);

  useImperativeHandle(
    ref,
    () => ({
      setExpandedFeedItemId,
      setActiveItem,
      setShouldAllowChatAutoOpen,
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
                      ref={(ref) => {
                        refsByItemId.current[item.itemId] = ref;
                      }}
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
                      shouldCheckItemVisibility={
                        !item.feedItemFollowWithMetadata ||
                        item.feedItemFollowWithMetadata.userId !== userId
                      }
                      onActiveItemDataChange={handleActiveFeedItemDataChange}
                      directParent={outerCommon?.directParent}
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
              (chatItem?.discussion ? (
                <DesktopChat
                  className={desktopRightPaneClassName}
                  chatItem={chatItem}
                  commonId={selectedItemCommonData?.id || ""}
                  governanceCircles={governance?.circles}
                  commonMember={commonMember}
                  withTitle={settings?.withDesktopChatTitle}
                  titleRightContent={followFeedItemEl}
                  onMessagesAmountChange={handleMessagesAmountChange}
                  directParent={outerCommon?.directParent}
                  onJoinCommon={onJoinCommon}
                  isJoinPending={isJoinPending}
                  onUserClick={handleUserClick}
                  onFeedItemClick={handleFeedItemClick}
                  onInternalLinkClick={handleInternalLinkClick}
                />
              ) : (
                <DesktopChatPlaceholder
                  className={desktopRightPaneClassName}
                  isItemSelected={Boolean(selectedItemCommonData || chatItem)}
                  withTitle={settings?.withDesktopChatTitle}
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
                directParent={outerCommon?.directParent}
                onClose={handleMobileChatClose}
                onJoinCommon={onJoinCommon}
                isJoinPending={isJoinPending}
                onUserClick={handleUserClick}
                onFeedItemClick={handleFeedItemClick}
                onInternalLinkClick={handleInternalLinkClick}
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
                      isMainModalOpen={Boolean(chatItem)}
                      shouldAutoOpenPreview={shouldAutoExpandItem}
                    />
                  )}
              </MobileChat>
            )}
            {governance && outerCommon && (
              <>
                <MembershipRequestModal
                  isShowing={isCommonJoinModalOpen}
                  onClose={onCommonJoinModalClose}
                  common={outerCommon}
                  governance={governance}
                />
                <JoinProjectModal
                  isShowing={isProjectJoinModalOpen}
                  onClose={onProjectJoinModalClose}
                  common={outerCommon}
                  governance={governance}
                  onRequestCreated={() => null}
                />
              </>
            )}
            {userForProfile.userForProfileData &&
              (!isTabletView ? (
                <DesktopProfile
                  governanceCircles={governance?.circles}
                  className={desktopRightPaneClassName}
                  userId={userForProfile.userForProfileData.userId}
                  commonId={userForProfile.userForProfileData.commonId}
                  chatChannel={userForProfile.userForProfileData.chatChannel}
                  onDMClick={onDMClick}
                  withTitle={settings?.withDesktopChatTitle}
                  onClose={handleProfileClose}
                  onChatChannelCreate={handleChatChannelCreate}
                  onUserClick={handleUserClick}
                />
              ) : (
                <MobileProfile
                  userId={userForProfile.userForProfileData.userId}
                  commonId={userForProfile.userForProfileData.commonId}
                  chatChannel={userForProfile.userForProfileData.chatChannel}
                  onDMClick={onDMClick}
                  onClose={handleProfileClose}
                  onChatChannelCreate={handleChatChannelCreate}
                  onUserClick={handleUserClick}
                />
              ))}
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
