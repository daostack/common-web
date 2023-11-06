import React, { MouseEventHandler, ReactNode, useContext } from "react";
import { ContextMenuItem } from "@/shared/interfaces";
import {
  CommonFeed,
  CommonFeedType,
  Discussion,
  PredefinedTypes,
} from "@/shared/models";
import { parseStringToTextEditorValue, TextEditorValue } from "@/shared/ui-kit";
import { FeedCardSettings } from "../FeedCard";
import { GetNonAllowedItemsOptions } from "./types";

export interface FeedItemBaseContentProps {
  className?: string;
  titleWrapperClassName?: string;
  lastActivity: number;
  unreadMessages?: number;
  isMobileView: boolean;
  isActive?: boolean;
  isExpanded?: boolean;
  title?: string | ReactNode;
  lastMessage?: TextEditorValue;
  canBeExpanded?: boolean;
  onClick?: () => void;
  onExpand?: MouseEventHandler;
  menuItems?: ContextMenuItem[];
  type?: CommonFeedType;
  seenOnce?: boolean;
  seen?: boolean;
  ownerId?: string;
  commonName?: string;
  commonId?: string;
  renderImage?: (className?: string) => ReactNode;
  renderLeftContent?: () => ReactNode;
  image?: string;
  imageAlt?: string;
  isImageRounded?: boolean;
  isProject?: boolean;
  isPinned?: boolean;
  isFollowing?: boolean;
  discussionPredefinedType?: PredefinedTypes;
  hasFiles?: boolean;
  hasImages?: boolean;
  isLoading?: boolean;
  shouldHideBottomContent?: boolean;
  dmUserId?: string;
  hasUnseenMention?: boolean;
}

export interface GetLastMessageOptions {
  commonFeedType: CommonFeedType;
  lastMessage?: CommonFeed["data"]["lastMessage"];
  discussion?: Discussion | null;
  currentUserId?: string;
  feedItemCreatorName?: string;
  commonName: string;
  isProject: boolean;
  type?: CommonFeedType;
  seenOnce?: boolean;
  ownerId?: string;
  hasFiles?: boolean;
  hasImages?: boolean;
}

export interface FeedItemContextValue {
  setExpandedFeedItemId?: (feedItemId: string | null) => void;
  renderFeedItemBaseContent?: (props: FeedItemBaseContentProps) => ReactNode;
  onFeedItemUpdate?: (item: CommonFeed, isRemoved: boolean) => void;
  feedCardSettings?: FeedCardSettings;
  getLastMessage: (options: GetLastMessageOptions) => TextEditorValue;
  getNonAllowedItems?: GetNonAllowedItemsOptions;
  onUserSelect?: (userId: string, commonId?: string) => void;
}

export const FeedItemContext = React.createContext<FeedItemContextValue>({
  getLastMessage: () => parseStringToTextEditorValue(),
});

export const useFeedItemContext = (): FeedItemContextValue =>
  useContext(FeedItemContext);
