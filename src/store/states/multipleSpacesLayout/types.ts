import { InboxItemType } from "@/shared/constants";
import { ProjectsStateItem } from "../projects";

export interface MultipleSpacesLayoutBaseActiveItem {
  id: string; // feed item id or chat channel id
  name: string;
  image?: string;
}

export type MultipleSpacesLayoutActiveChatChannelItem =
  MultipleSpacesLayoutBaseActiveItem;

export interface MultipleSpacesLayoutActiveFeedItem
  extends MultipleSpacesLayoutBaseActiveItem {
  commonId: string;
}

export interface MultipleSpacesLayoutChatChannelBreadcrumbs {
  type: InboxItemType.ChatChannel;
  activeItem: MultipleSpacesLayoutActiveChatChannelItem;
}

export interface MultipleSpacesLayoutFeedItemBreadcrumbs {
  type: InboxItemType.FeedItemFollow;
  activeItem: MultipleSpacesLayoutActiveFeedItem | null;
  items: ProjectsStateItem[];
  areItemsLoading: boolean;
  areItemsFetched: boolean;
}

export type MultipleSpacesLayoutBreadcrumbs =
  | MultipleSpacesLayoutFeedItemBreadcrumbs
  | MultipleSpacesLayoutChatChannelBreadcrumbs;

export interface MultipleSpacesLayoutState {
  breadcrumbs: MultipleSpacesLayoutBreadcrumbs | null;
  previousBreadcrumbs: MultipleSpacesLayoutBreadcrumbs | null;
}

export type { ProjectsStateItem } from "../projects";
