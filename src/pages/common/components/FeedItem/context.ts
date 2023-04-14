import React, { MouseEventHandler, ReactNode, useContext } from "react";
import { ContextMenuItem } from "@/shared/interfaces";
import { CommonFeedType } from "@/shared/models";
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
}

export interface FeedItemContextValue {
  setExpandedFeedItemId?: (feedItemId: string | null) => void;
  renderFeedItemBaseContent?: (props: FeedItemBaseContentProps) => ReactNode;
  feedCardSettings?: FeedCardSettings;
}

export const FeedItemContext = React.createContext<FeedItemContextValue>({});

export const useFeedItemContext = (): FeedItemContextValue =>
  useContext(FeedItemContext);
