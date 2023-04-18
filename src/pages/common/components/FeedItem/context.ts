import React, { MouseEventHandler, ReactNode, useContext } from "react";
import { ContextMenuItem } from "@/shared/interfaces";
import { CommonFeed, CommonFeedType, Discussion } from "@/shared/models";
import { FeedCardSettings } from "../FeedCard";

export interface FeedItemBaseContentProps {
  className?: string;
  lastActivity: number;
  unreadMessages?: number;
  isMobileView: boolean;
  isActive?: boolean;
  isExpanded?: boolean;
  title?: string;
  lastMessage?: string;
  canBeExpanded?: boolean;
  onClick?: () => void;
  onExpand?: MouseEventHandler;
  menuItems?: ContextMenuItem[];
  type?: CommonFeedType;
  seenOnce?: boolean;
  ownerId?: string;
  image?: string;
  imageAlt?: string;
  isProject?: boolean;
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
}

export interface FeedItemContextValue {
  setExpandedFeedItemId?: (feedItemId: string | null) => void;
  renderFeedItemBaseContent?: (props: FeedItemBaseContentProps) => ReactNode;
  onFeedItemUpdate?: (item: CommonFeed, isRemoved: boolean) => void;
  feedCardSettings?: FeedCardSettings;
  getLastMessage: (options: GetLastMessageOptions) => string;
}

export const FeedItemContext = React.createContext<FeedItemContextValue>({
  getLastMessage: () => "",
});

export const useFeedItemContext = (): FeedItemContextValue =>
  useContext(FeedItemContext);
