import React, {
  CSSProperties,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  ReactNode,
  ForwardRefRenderFunction,
} from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useDeepCompareEffect, useKey, useWindowSize } from "react-use";
import classNames from "classnames";
import { selectUser } from "@/pages/Auth/store/selectors";
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
  ChatContext,
} from "@/pages/common/components/ChatComponent";
import {
  FeedLayoutEvent,
  FeedLayoutEventEmitter,
} from "@/pages/commonFeed/components/FeedLayout/events";
import {
  AI_PRO_USER,
  AI_USER,
  InboxItemType,
  LOADER_APPEARANCE_DELAY,
  QueryParamKey,
  ROUTE_PATHS,
} from "@/shared/constants";
import { useRoutesContext } from "@/shared/contexts";
import {
  useElementPresence,
  useMemoizedFunction,
  useQueryParams,
} from "@/shared/hooks";
import { useGovernanceByCommonId } from "@/shared/hooks/useCases";
import { useDisableOverscroll } from "@/shared/hooks/useDisableOverscroll";
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
import { InfiniteScroll, Loader, TextEditorValue } from "@/shared/ui-kit";
import { InternalLinkData } from "@/shared/utils";
import {
  addQueryParam,
  deleteQueryParam,
  getParamsFromOneOfRoutes,
  getUserName,
} from "@/shared/utils";
import {
  selectCreatedOptimisticFeedItems,
  selectRecentStreamId,
} from "@/store/states";
import { MIN_CONTENT_WIDTH } from "../../constants";
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
import {
  BATCHES_AMOUNT_TO_PRELOAD,
  ITEMS_AMOUNT_TO_PRE_LOAD_MESSAGES,
  MENTION_TAG_ELEMENT,
} from "./constants";
import { useUserForProfile } from "./hooks";
import {
  checkShouldAutoOpenPreview,
  getDefaultSize,
  getDMChatChannelItemByUserIds,
  getItemCommonData,
  getSplitViewMaxSize,
  saveContentSize,
} from "./utils";
import styles from "./FeedLayout.module.scss";

export interface FeedLayoutOuterStyles {
  splitView?: string;
  desktopRightPane?: string;
}

export interface FeedLayoutSettings {
  withDesktopChatTitle?: boolean;
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
  batchNumber?: number;
  isPreloadDisabled?: boolean;
  onFetchNext: (feedItemId?: string) => void;
  renderFeedItemBaseContent: (props: FeedItemBaseContentProps) => ReactNode;
  renderChatChannelItem?: (props: ChatChannelFeedLayoutItemProps) => ReactNode;
  onFeedItemUpdate?: (item: CommonFeed, isRemoved: boolean) => void;
  onFeedItemUnfollowed?: (itemId: string) => void;
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
  onChatChannelCreate?: (chatChannel: ChatChannel) => void;
  outerStyles?: FeedLayoutOuterStyles;
  settings?: FeedLayoutSettings;
  renderChatInput?: () => ReactNode;
  onPullToRefresh?: () => void;
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
    isPreloadDisabled = false,
    batchNumber,
    onFetchNext,
    renderFeedItemBaseContent,
    renderChatChannelItem,
    onFeedItemUpdate,
    onFeedItemUnfollowed,
    getLastMessage,
    sharedFeedItemId,
    emptyText,
    getNonAllowedItems,
    onActiveItemChange,
    onActiveItemDataChange,
    onMessagesAmountEmptinessToggle,
    onFeedItemSelect,
    onChatChannelCreate,
    outerStyles,
    settings,
    renderChatInput,
    onPullToRefresh,
  } = props;
  useDisableOverscroll();
  const { getCommonPagePath } = useRoutesContext();
  const refsByItemId = useRef<Record<string, FeedItemRef | null>>({});
  const { width: windowWidth } = useWindowSize();
  const history = useHistory();
  const queryParams = useQueryParams();
  const isTabletView = useIsTabletView();
  const user = useSelector(selectUser());
  const createdOptimisticFeedItems = useSelector(
    selectCreatedOptimisticFeedItems,
  );
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
  const commonMember = useMemo(
    () =>
      chatItem?.nestedItemData?.commonMember ||
      outerCommonMember ||
      fetchedCommonMember,
    [
      chatItem?.nestedItemData?.commonMember,
      outerCommonMember,
      fetchedCommonMember,
    ],
  );

  const [
    commonMemberForSpecificCommonIds,
    setCommonMemberForSpecificCommonIds,
  ] = useState({});

  useDeepCompareEffect(() => {
    const chatItemCommonMember = { ...chatItem?.nestedItemData?.commonMember };

    setCommonMemberForSpecificCommonIds((prevCommonMembers) => {
      if (chatItemCommonMember?.commonId) {
        prevCommonMembers[chatItemCommonMember.commonId] = chatItemCommonMember;
      }

      if (outerCommonMember?.commonId) {
        prevCommonMembers[outerCommonMember.commonId] = outerCommonMember;
      }

      if (fetchedCommonMember?.commonId) {
        prevCommonMembers[fetchedCommonMember.commonId] = fetchedCommonMember;
      }

      return prevCommonMembers;
    });
  }, [
    fetchedCommonMember,
    chatItem?.nestedItemData?.commonMember,
    outerCommonMember,
  ]);
  const userForProfile = useUserForProfile();
  const governance = chatItem?.nestedItemData
    ? fetchedGovernance || outerGovernance
    : outerGovernance || fetchedGovernance;

  const [splitPaneRef, setSplitPaneRef] = useState<Element | null>(null);
  const maxContentSize =
    settings?.getSplitViewMaxSize?.(windowWidth) ??
    getSplitViewMaxSize(windowWidth);
  const [realContentWidth, setRealContentWidth] = useState(() =>
    getDefaultSize(windowWidth, maxContentSize),
  );
  const contentWidth = Math.min(realContentWidth, maxContentSize);
  const [expandedFeedItemId, setExpandedFeedItemId] = useState<string | null>(
    null,
  );
  const [isLoaderAfterRefresh, setIsLoaderAfterRefresh] = useState(false);
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

  const dmChatChannelItemForProfile = useMemo(
    () =>
      getDMChatChannelItemByUserIds(
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
    if (dmChatChannelItemForProfile?.itemId) {
      return dmChatChannelItemForProfile.itemId;
    }
    if (
      userForProfile.userForProfileData ||
      shouldAllowChatAutoOpen === false
    ) {
      return;
    }
    if (sharedFeedItemId) {
      return sharedFeedItemId;
    }
    if (chatItem?.feedItemId) {
      return;
    }

    const foundItem = allFeedItems?.find((item) => {
      if (!checkIsFeedItemFollowLayoutItem(item)) {
        return true;
      }
      if (
        ![CommonFeedType.Proposal, CommonFeedType.Discussion].includes(
          item.feedItem.data.type,
        )
      ) {
        return false;
      }

      return Boolean(userId) || item.feedItem.circleVisibility.length === 0;
    });

    return foundItem?.itemId;
  }, [
    dmChatChannelItemForProfile?.itemId,
    allFeedItems,
    chatItem?.feedItemId,
    sharedFeedItemId,
    userForProfile.userForProfileData,
    shouldAllowChatAutoOpen,
    userId,
  ]);
  const activeFeedItemId = chatItem?.feedItemId || feedItemIdForAutoChatOpen;
  const sizeKey = `${windowWidth}_${contentWidth}`;

  const activeFeedItemIndex = useMemo(
    () => allFeedItems.findIndex((item) => item.itemId === activeFeedItemId),
    [activeFeedItemId, allFeedItems],
  );

  const getUserCircleIds = useCallback(
    (commonId) => {
      return Object.values(
        commonMemberForSpecificCommonIds[commonId]?.circles.map ??
          commonMember?.circles.map ??
          {},
      ) as string[];
    },
    [commonMemberForSpecificCommonIds, commonMember?.circles.map],
  );

  const selectedFeedItem = useMemo(
    () =>
      chatItem?.nestedItemData?.feedItem ||
      allFeedItems?.find((item) => item.itemId === activeFeedItemId),
    [chatItem?.nestedItemData?.feedItem, allFeedItems, activeFeedItemId],
  );
  const selectedItemCommonData = checkIsFeedItemFollowLayoutItem(
    selectedFeedItem,
  )
    ? getItemCommonData(
        selectedFeedItem?.feedItemFollowWithMetadata,
        chatItem?.nestedItemData?.common || outerCommon,
      )
    : null;

  const handleUserWithCommonClick = useCallback(
    (userId: string, commonId?: string) => {
      if ([AI_USER.uid, AI_PRO_USER.uid].includes(userId)) {
        return;
      }

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

  const setActiveChatItem = useCallback((nextChatItem: ChatItem | null) => {
    setShouldAllowChatAutoOpen(false);
    setChatItem(nextChatItem);
  }, []);

  const isMentionOpen = useElementPresence(
    MENTION_TAG_ELEMENT.key,
    MENTION_TAG_ELEMENT.value,
  );
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleArrowUp = (
    event,
    activeFeedItemIndex,
    allFeedItems,
    isMentionOpen,
    setChatItem,
  ) => {
    if (!isMentionOpen && !isInputFocused) {
      event.preventDefault();
      event.stopPropagation();

      if (activeFeedItemIndex > 0) {
        const nextFeedItemId = allFeedItems[activeFeedItemIndex - 1]?.itemId;

        setChatItem({ feedItemId: nextFeedItemId });
      }
    }
  };

  const handleArrowDown = (
    event,
    activeFeedItemIndex,
    allFeedItems,
    isMentionOpen,
    setChatItem,
  ) => {
    if (!isMentionOpen && !isInputFocused) {
      event.preventDefault();
      event.stopPropagation();

      if (activeFeedItemIndex < allFeedItems.length - 1) {
        const nextFeedItemId = allFeedItems[activeFeedItemIndex + 1]?.itemId;

        setChatItem({ feedItemId: nextFeedItemId });
      }
    }
  };

  // Inside your component
  useKey(
    "ArrowUp",
    (event) =>
      handleArrowUp(
        event,
        activeFeedItemIndex,
        allFeedItems,
        isMentionOpen,
        setChatItem,
      ),
    {},
    [activeFeedItemIndex, allFeedItems, isMentionOpen, isInputFocused],
  );

  useKey(
    "ArrowDown",
    (event) =>
      handleArrowDown(
        event,
        activeFeedItemIndex,
        allFeedItems,
        isMentionOpen,
        setChatItem,
      ),
    {},
    [activeFeedItemIndex, allFeedItems, isMentionOpen, isInputFocused],
  );

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
    onChatChannelCreate?.(chatChannel);

    if (!isTabletView) {
      setActiveChatItem(null);
    }
  };

  const handleProfileClose = () => {
    userForProfile.resetUserForProfileData(isTabletView);
  };

  const handleDMClick = () => {
    if (
      checkIsChatChannelLayoutItem(selectedFeedItem) &&
      selectedFeedItem.chatChannel.participants.length <= 2
    ) {
      handleProfileClose();
      return;
    }

    setActiveChatItem(null);
    setShouldAllowChatAutoOpen(true);
  };

  const getItemsContainerEl = useCallback(() => {
    const containerEl = isTabletView
      ? window
      : document.getElementsByClassName("Pane Pane1")[0];

    return containerEl || null;
  }, [isTabletView]);

  const onDMClick =
    !isTabletView && dmChatChannelItemForProfile ? handleDMClick : undefined;

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

    if (chatItem?.feedItemId === feedItemId && !messageId) {
      return;
    }

    const queryParamsForPath = {
      item: feedItemId,
      message: messageId,
    };

    if (commonId && commonId !== outerCommon?.id) {
      history.push(getCommonPagePath(commonId, queryParamsForPath));
      return;
    }
    if (chatItem?.nestedItemData) {
      history.push(
        getCommonPagePath(
          chatItem?.nestedItemData.common.id,
          queryParamsForPath,
        ),
      );
      return;
    }

    setActiveChatItem({ feedItemId });

    const itemExists = allFeedItems.some((item) => item.itemId === feedItemId);

    if (itemExists) {
      refsByItemId.current[feedItemId]?.scrollToItem();
    } else {
      onFetchNext(feedItemId);
      const paneEl = document.getElementsByClassName("Pane Pane1")[0];
      const containerEl = isTabletView ? window : paneEl;
      const scrollHeight = isTabletView
        ? document.body.scrollHeight
        : paneEl?.scrollHeight;

      if (containerEl) {
        setTimeout(() => {
          containerEl.scrollTo({
            top: scrollHeight,
            behavior: "smooth",
          });
        }, 50);
      }
    }

    if (messageId) {
      addQueryParam(QueryParamKey.Message, messageId);
    }
  };

  const handleFeedItemClick = useMemoizedFunction(
    onFeedItemSelect
      ? handleFeedItemClickExternal
      : handleFeedItemClickInternal,
  );

  const handleInternalLinkClick = useMemoizedFunction(
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
  );

  const handleRefresh = async () => {
    setIsLoaderAfterRefresh(true);
    onPullToRefresh?.();
  };

  const handleRefSet = useCallback(
    (ref: FeedItemRef | null) => {
      if (ref) {
        refsByItemId.current[ref.itemId] = ref;
      }
    },
    [refsByItemId],
  );

  // We should try to set here only the data which rarely can be changed,
  // so we will not have extra re-renders of ALL rendered items
  const feedItemContextValue = useMemo<FeedItemContextValue>(
    () => ({
      setIsInputFocused,
      setExpandedFeedItemId,
      renderFeedItemBaseContent,
      onFeedItemUpdate,
      onFeedItemUnfollowed,
      getLastMessage,
      getNonAllowedItems,
      onUserSelect: handleUserWithCommonClick,
      onFeedItemClick: handleFeedItemClick,
      onInternalLinkClick: handleInternalLinkClick,
      onActiveItemDataChange: handleActiveFeedItemDataChange,
    }),
    [
      setIsInputFocused,
      renderFeedItemBaseContent,
      onFeedItemUpdate,
      onFeedItemUnfollowed,
      getLastMessage,
      getNonAllowedItems,
      handleUserWithCommonClick,
      handleFeedItemClick,
      handleInternalLinkClick,
      handleActiveFeedItemDataChange,
    ],
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
    saveContentSize(contentWidth);
  }, [contentWidth]);

  useEffect(() => {
    onActiveItemChange?.(activeFeedItemId);

    if (activeFeedItemId) {
      userForProfile.resetUserForProfileData(true);
    }

    FeedLayoutEventEmitter.emit(
      FeedLayoutEvent.ActiveFeedItemUpdated,
      activeFeedItemId || null,
    );
  }, [activeFeedItemId]);

  useEffect(() => {
    FeedLayoutEventEmitter.emit(
      FeedLayoutEvent.ExpandedFeedItemUpdated,
      expandedFeedItemId || null,
    );
  }, [expandedFeedItemId]);

  useEffect(() => {
    if (selectedFeedItem?.itemId && !isTabletView) {
      refsByItemId.current[selectedFeedItem.itemId]?.scrollToItem();
    }
    if (selectedFeedItem?.itemId || (chatItem && !chatItem.discussion)) {
      return;
    }

    if (!recentStreamId) {
      setActiveChatItem(null);
    }

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
    if (
      !isPreloadDisabled &&
      batchNumber &&
      batchNumber >= 1 &&
      batchNumber <= BATCHES_AMOUNT_TO_PRELOAD
    ) {
      onFetchNext();
    }
  }, [batchNumber, isPreloadDisabled]);

  useEffect(() => {
    if (
      isTabletView &&
      sharedFeedItemId &&
      allFeedItems.length > 0 &&
      allFeedItems.some((item) => item.itemId === sharedFeedItemId)
    ) {
      deleteQueryParam(QueryParamKey.Item, true);
      setActiveChatItem({ feedItemId: sharedFeedItemId });
    }
  }, [sharedFeedItemId, isTabletView, allFeedItems]);

  useEffect(() => {
    if (allFeedItems.length) {
      setIsLoaderAfterRefresh(false);
    }
  }, [Boolean(allFeedItems.length)]);

  useEffect(() => {
    if (isTabletView) {
      setSplitPaneRef(null);
      return;
    }
    if (!splitPaneRef) {
      setSplitPaneRef(document.getElementsByClassName("SplitPane")?.[0]);
    }
  }, [isTabletView, splitPaneRef]);

  useImperativeHandle(
    ref,
    () => ({
      setExpandedFeedItemId,
      setActiveItem,
      setShouldAllowChatAutoOpen,
      getItemsContainerEl,
    }),
    [setActiveItem, getItemsContainerEl],
  );

  const pageContentStyles = {
    "--chat-w": `${
      splitPaneRef ? splitPaneRef.clientWidth - contentWidth : 0
    }px`,
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
            id="feedLayoutWrapper"
            className={classNames(styles.content, className, {
              [styles.contentCentered]: isContentEmpty,
            })}
          >
            {topContent}
            {isContentEmpty ? (
              <p className={styles.emptyText}>{emptyText}</p>
            ) : (
              <PullToRefresh
                isPullable={isTabletView && Boolean(onPullToRefresh)}
                className={styles.pullToRefresh}
                onRefresh={handleRefresh}
                refreshingContent={<Loader />}
              >
                <InfiniteScroll
                  markerClassName={
                    allFeedItems && allFeedItems.length > 7
                      ? styles.infiniteScrollMarker
                      : ""
                  }
                  onFetchNext={onFetchNext}
                  isLoading={loading}
                  loaderDelay={
                    isLoaderAfterRefresh ? 0 : LOADER_APPEARANCE_DELAY
                  }
                >
                  {allFeedItems?.map((item, index) => {
                    const isActive = item.itemId === activeFeedItemId;
                    const shouldPreLoadMessages =
                      index < ITEMS_AMOUNT_TO_PRE_LOAD_MESSAGES;

                    if (checkIsFeedItemFollowLayoutItem(item)) {
                      const commonData = getItemCommonData(
                        item.feedItemFollowWithMetadata,
                        outerCommon,
                      );

                      const isPinned = (
                        outerCommon?.pinnedFeedItems || []
                      ).some(
                        (pinnedItem) =>
                          pinnedItem.feedObjectId === item.feedItem.id,
                      );

                      return (
                        <FeedItem
                          ref={handleRefSet}
                          key={item.feedItem.id}
                          isOptimisticallyCreated={createdOptimisticFeedItems.has(
                            item.feedItem.data.id,
                          )}
                          commonMember={commonMember}
                          commonId={commonData?.id}
                          commonName={commonData?.name || ""}
                          commonImage={commonData?.image || ""}
                          commonNotion={outerCommon?.notion}
                          pinnedFeedItems={outerCommon?.pinnedFeedItems}
                          isProject={commonData?.isProject}
                          isPinned={isPinned}
                          item={item.feedItem}
                          governanceCircles={governance?.circles}
                          isMobileVersion={isTabletView}
                          userCircleIds={getUserCircleIds(commonData?.id)}
                          isActive={isActive}
                          isExpanded={item.feedItem.id === expandedFeedItemId}
                          sizeKey={isActive ? sizeKey : undefined}
                          currentUserId={userId}
                          shouldCheckItemVisibility={
                            !item.feedItemFollowWithMetadata ||
                            item.feedItemFollowWithMetadata.userId !== userId
                          }
                          directParent={outerCommon?.directParent}
                          rootCommonId={outerCommon?.rootCommonId}
                          shouldPreLoadMessages={shouldPreLoadMessages}
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
              </PullToRefresh>
            )}
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
                  renderChatInput={renderChatInput}
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
                chatChannel={userForProfile.userForProfileData?.chatChannel}
                onClose={handleMobileChatClose}
                renderChatInput={renderChatInput}
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
                      userCircleIds={getUserCircleIds(
                        selectedItemCommonData.id,
                      )}
                      isShowFeedItemDetailsModal={isShowFeedItemDetailsModal}
                      sizeKey={sizeKey}
                      isMainModalOpen={Boolean(chatItem)}
                      shouldAutoOpenPreview={shouldAutoExpandItem}
                    />
                  )}
              </MobileChat>
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
      size={contentWidth}
      minSize={MIN_CONTENT_WIDTH}
      maxSize={maxContentSize}
      onChange={setRealContentWidth}
    >
      {contentEl}
    </SplitView>
  );
};

export default forwardRef(FeedLayout);
