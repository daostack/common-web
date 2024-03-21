export interface FeedCardSettings {
  commonCardClassName?: string;
  shouldHideCardStyles?: boolean;
  withHovering?: boolean;
}

export interface FeedCardRef {
  itemId: string;
  scrollToItem: () => void;
}
