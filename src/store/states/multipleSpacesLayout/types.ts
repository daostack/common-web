import { InboxItemType } from "@/shared/constants";
import { ProjectsStateItem } from "../projects";

export interface MultipleSpacesLayoutActiveItem {
  id: string; // feed item id or chat channel id
  name: string;
  image?: string;
}

export interface MultipleSpacesLayoutChatChannelBreadcrumbs {
  type: InboxItemType.ChatChannel;
  activeItem: MultipleSpacesLayoutActiveItem;
}

export interface MultipleSpacesLayoutFeedItemBreadcrumbs {
  type: InboxItemType.FeedItemFollow;
  activeItem: MultipleSpacesLayoutActiveItem | null;
  activeCommonId: string;
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
  backUrl: string | null;
}

export type { ProjectsStateItem } from "../projects";
