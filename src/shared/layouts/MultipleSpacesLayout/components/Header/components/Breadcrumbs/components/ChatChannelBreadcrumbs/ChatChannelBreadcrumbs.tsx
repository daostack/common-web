import React, { FC } from "react";
import { MultipleSpacesLayoutChatChannelBreadcrumbs } from "@/store/states";
import feedItemBreadcrumbsStyles from "../FeedItemBreadcrumbs/FeedItemBreadcrumbs.module.scss";

interface ChatChannelBreadcrumbsProps {
  breadcrumbs: MultipleSpacesLayoutChatChannelBreadcrumbs;
}

const ChatChannelBreadcrumbs: FC<ChatChannelBreadcrumbsProps> = (props) => {
  const { breadcrumbs } = props;

  return (
    <ul className={feedItemBreadcrumbsStyles.container}>
      {breadcrumbs.activeItem.name}
    </ul>
  );
};

export default ChatChannelBreadcrumbs;
