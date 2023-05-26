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
  lastActivity: number;
  unreadMessages?: number;
  isMobileView: boolean;
  isActive?: boolean;
  isExpanded?: boolean;
  title?: string;
  lastMessage?: TextEditorValue;
  canBeExpanded?: boolean;
  onClick?: () => void;
  onExpand?: MouseEventHandler;
  menuItems?: ContextMenuItem[];
  type?: CommonFeedType;
  seenOnce?: boolean;
  ownerId?: string;
  commonName?: string;
  renderImage?: (className?: string) => ReactNode;
  image?: string;
  imageAlt?: string;
  isImageRounded?: boolean;
  isProject?: boolean;
  isPinned?: boolean;
  discussionPredefinedType?: PredefinedTypes;
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
  getLastMessage: (options: GetLastMessageOptions) => TextEditorValue;
  getNonAllowedItems?: GetNonAllowedItemsOptions;
}

export const FeedItemContext = React.createContext<FeedItemContextValue>({
  getLastMessage: () => parseStringToTextEditorValue(),
});

export const useFeedItemContext = (): FeedItemContextValue =>
  useContext(FeedItemContext);
