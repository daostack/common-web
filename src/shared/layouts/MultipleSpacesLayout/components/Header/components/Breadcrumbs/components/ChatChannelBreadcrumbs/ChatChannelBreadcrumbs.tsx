import React, { FC } from "react";
import { MultipleSpacesLayoutChatChannelBreadcrumbs } from "@/store/states";
import { ActiveBreadcrumbsItem } from "../ActiveBreadcrumbsItem";
import feedItemBreadcrumbsStyles from "../FeedItemBreadcrumbs/FeedItemBreadcrumbs.module.scss";

interface ChatChannelBreadcrumbsProps {
  breadcrumbs: MultipleSpacesLayoutChatChannelBreadcrumbs;
}

const ChatChannelBreadcrumbs: FC<ChatChannelBreadcrumbsProps> = (props) => {
  const { breadcrumbs } = props;

  return (
    <ul className={feedItemBreadcrumbsStyles.container}>
      <ActiveBreadcrumbsItem
        name={breadcrumbs.activeItem.name}
        image={breadcrumbs.activeItem.image}
      />
    </ul>
  );
};

export default ChatChannelBreadcrumbs;
