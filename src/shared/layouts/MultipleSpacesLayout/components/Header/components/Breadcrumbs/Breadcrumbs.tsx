import React, { FC } from "react";
import { useSelector } from "react-redux";
import { InboxItemType } from "@/shared/constants";
import { selectMultipleSpacesLayoutBreadcrumbs } from "@/store/states";
import { ChatChannelBreadcrumbs, FeedItemBreadcrumbs } from "./components";

const Breadcrumbs: FC = () => {
  const breadcrumbs = useSelector(selectMultipleSpacesLayoutBreadcrumbs);

  if (breadcrumbs?.type === InboxItemType.ChatChannel) {
    return <ChatChannelBreadcrumbs breadcrumbs={breadcrumbs} />;
  }
  if (breadcrumbs?.type === InboxItemType.FeedItemFollow) {
    return <FeedItemBreadcrumbs breadcrumbs={breadcrumbs} />;
  }

  return null;
};

export default Breadcrumbs;
